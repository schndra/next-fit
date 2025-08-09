"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useUserAddresses } from "../hooks/use-checkout";
import { formatAddressOneLine } from "../utils";
import type { ShippingAddress } from "../types";
import { ShippingAddressForm } from "./shipping-address-form";

interface ShippingAddressSelectorProps {
  selectedAddress?: ShippingAddress;
  onAddressSelect: (address: ShippingAddress) => void;
  onNext: () => void;
}

export function ShippingAddressSelector({
  selectedAddress,
  onAddressSelect,
  onNext,
}: ShippingAddressSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: session } = useSession();
  const { data: addresses, isLoading } = useUserAddresses(session?.user?.id);

  if (isLoading) {
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

  // If no addresses and user wants to add one, show the form
  if (!addresses || addresses.length === 0) {
    if (showAddForm) {
      return (
        <div className="space-y-4">
          <ShippingAddressForm
            selectedAddress={selectedAddress}
            onAddressSelect={(address) => {
              onAddressSelect(address);
              setShowAddForm(false);
            }}
            onNext={onNext}
          />
          <Button
            variant="outline"
            onClick={() => setShowAddForm(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
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
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-4">No saved addresses found</p>
            <p className="text-sm text-gray-500 mb-6">
              Please add a shipping address to continue with your order
            </p>
            <Button onClick={() => setShowAddForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Shipping Address
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Saved Addresses */}
            <div className="space-y-3">
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
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Address Button */}
            <Button
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Address Form */}
      {showAddForm && (
        <ShippingAddressForm
          selectedAddress={selectedAddress}
          onAddressSelect={(address) => {
            onAddressSelect(address);
            setShowAddForm(false);
          }}
          onNext={onNext}
        />
      )}

      {/* Continue Button */}
      {selectedAddress?.id && (
        <Button onClick={onNext} className="w-full">
          Continue to Payment
        </Button>
      )}
    </div>
  );
}
