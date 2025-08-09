"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSaveAddress } from "../hooks/use-checkout";
import type { ShippingAddress, ShippingAddressData } from "../types";

interface ShippingAddressFormProps {
  selectedAddress?: ShippingAddress;
  onAddressSelect: (address: ShippingAddress) => void;
  onNext: () => void;
  onCancel?: () => void;
}

export function ShippingAddressForm({
  selectedAddress,
  onAddressSelect,
  onNext,
  onCancel,
}: ShippingAddressFormProps) {
  const { data: session } = useSession();
  const saveAddressMutation = useSaveAddress();

  const [formData, setFormData] = useState<ShippingAddressData>({
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.address1.trim()) {
      newErrors.address1 = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State/Province is required";
    }
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof ShippingAddressData,
    value: string | boolean
  ) => {
    setFormData((prev: ShippingAddressData) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !session?.user?.id) return;

    try {
      const newAddress = await saveAddressMutation.mutateAsync({
        userId: session.user.id,
        addressData: formData,
      });
      onAddressSelect(newAddress);
      setFormData({
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
      });
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Add New Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {saveAddressMutation.isPending && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <p>Saving address...</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
                className={errors.first_name ? "border-red-500" : ""}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                className={errors.last_name ? "border-red-500" : ""}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="address1">Address Line 1 *</Label>
            <Input
              id="address1"
              value={formData.address1}
              onChange={(e) => handleInputChange("address1", e.target.value)}
              className={errors.address1 ? "border-red-500" : ""}
            />
            {errors.address1 && (
              <p className="text-red-500 text-sm mt-1">{errors.address1}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address2">Address Line 2 (Optional)</Label>
            <Input
              id="address2"
              value={formData.address2}
              onChange={(e) => handleInputChange("address2", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postal_code">Postal Code *</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) =>
                  handleInputChange("postal_code", e.target.value)
                }
                className={errors.postal_code ? "border-red-500" : ""}
              />
              {errors.postal_code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.postal_code}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) =>
                handleInputChange("is_default", !!checked)
              }
            />
            <Label htmlFor="is_default">Set as default address</Label>
          </div>

          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={saveAddressMutation.isPending}
              className="flex-1"
            >
              {saveAddressMutation.isPending ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
