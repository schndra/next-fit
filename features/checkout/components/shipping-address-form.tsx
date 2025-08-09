"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";
import {
  useUserAddresses,
  useSaveAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../hooks/use-checkout";
import { shippingAddressSchema } from "../schema";
import { formatAddressOneLine } from "../utils";
import { type ShippingAddressData } from "../schema";
import { type ShippingAddress } from "../types";
import type { z } from "zod";

type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;

interface ShippingAddressFormProps {
  selectedAddress?: ShippingAddress;
  onAddressSelect: (address: ShippingAddress) => void;
  onNext: (address: ShippingAddress) => void;
  onCancel?: () => void;
  defaultValues?: ShippingAddress;
}

export function ShippingAddressForm({
  selectedAddress,
  onAddressSelect,
  onNext,
  onCancel,
}: ShippingAddressFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(
    null
  );
  const { data: session } = useSession();

  const { data: addresses, isLoading, error } = useUserAddresses(session?.user?.id);
  const saveAddressMutation = useSaveAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const form = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema) as any,
    defaultValues: {
      first_name: "",
      last_name: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Sri Lanka",
      phone: "",
      is_default: false,
    },
  });

  const handleAddressSubmit = async (data: ShippingAddressFormData) => {
    if (!session?.user?.id) return;

    try {
      if (editingAddress) {
        const updatedAddress = await updateAddressMutation.mutateAsync({
          userId: session.user.id,
          addressId: editingAddress.id!,
          addressData: data,
        });
        onAddressSelect(updatedAddress);
      } else {
        const newAddress = await saveAddressMutation.mutateAsync({
          userId: session.user.id,
          addressData: data,
        });
        onAddressSelect(newAddress);
      }

      setIsDialogOpen(false);
      setEditingAddress(null);
      form.reset();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleEditAddress = (address: ShippingAddress) => {
    setEditingAddress(address);
    form.reset({
      first_name: address.first_name,
      last_name: address.last_name,
      company: address.company || "",
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone || "",
      is_default: address.is_default,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!session?.user?.id) return;

    try {
      await deleteAddressMutation.mutateAsync({
        userId: session.user.id,
        addressId,
      });

      // If the deleted address was selected, clear selection
      if (selectedAddress?.id === addressId) {
        onAddressSelect({} as ShippingAddress);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleNewAddress = () => {
    setEditingAddress(null);
    form.reset({
      first_name: session?.user?.name?.split(" ")[0] || "",
      last_name: session?.user?.name?.split(" ").slice(1).join(" ") || "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Sri Lanka",
      phone: "",
      is_default: false,
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-6">
              <p className="text-sm text-gray-600">Loading addresses...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-6">
              <p className="text-sm text-red-600">Failed to load addresses. Please try again.</p>
            </div>
          )}

          {/* Saved Addresses */}
          {!isLoading && !error && addresses && addresses.length > 0 ? (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Saved Addresses</Label>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddress?.id === address.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => onAddressSelect(address)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {address.first_name} {address.last_name}
                        </span>
                        {address.is_default && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      {address.company && (
                        <p className="text-sm text-gray-600">
                          {address.company}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {formatAddressOneLine(address)}
                      </p>
                      {address.phone && (
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(address);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id!);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !isLoading && !error ? (
            <div className="text-center py-6 space-y-2">
              <Label className="text-sm font-medium">No Saved Addresses</Label>
              <p className="text-sm text-gray-600">
                Please add your first shipping address to continue with checkout.
              </p>
            </div>
          ) : null}

          {addresses && addresses.length > 0 && <Separator />}

          {/* Add New Address */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleNewAddress}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddressSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Street address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Apartment, suite, etc."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Set as default address</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingAddress(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={
                        saveAddressMutation.isPending ||
                        updateAddressMutation.isPending
                      }
                    >
                      {editingAddress ? "Update" : "Save"} Address
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Continue Button */}
          {selectedAddress && (
            <Button 
              onClick={() => onNext(selectedAddress)} 
              className="w-full"
              disabled={!selectedAddress.id && !selectedAddress.address1}
            >
              Continue to Payment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
