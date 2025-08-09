"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock } from "lucide-react";
import { paymentMethodSchema, type PaymentMethodData } from "../schema";

interface PaymentMethodFormProps {
  onNext: (data: PaymentMethodData) => void;
  onBack: () => void;
  defaultValues?: Partial<PaymentMethodData>;
}

// Fake card data for testing
const FAKE_CARDS = [
  {
    type: "visa" as const,
    card_number: "4111 1111 1111 1111",
    expiry_month: "12",
    expiry_year: "2027",
    cvv: "123",
    cardholder_name: "John Doe",
    label: "Test Visa Card",
  },
  {
    type: "mastercard" as const,
    card_number: "5555 5555 5555 4444",
    expiry_month: "08",
    expiry_year: "2026",
    cvv: "456",
    cardholder_name: "Jane Smith",
    label: "Test Mastercard",
  },
  {
    type: "amex" as const,
    card_number: "3782 822463 10005",
    expiry_month: "03",
    expiry_year: "2028",
    cvv: "7890",
    cardholder_name: "Bob Johnson",
    label: "Test American Express",
  },
];

export function PaymentMethodForm({
  onNext,
  onBack,
  defaultValues,
}: PaymentMethodFormProps) {
  const [selectedFakeCard, setSelectedFakeCard] = useState<string>("");

  const form = useForm<PaymentMethodData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: defaultValues || {
      type: "visa",
      card_number: "",
      expiry_month: "",
      expiry_year: "",
      cvv: "",
      cardholder_name: "",
    },
  });

  const onSubmit = (data: PaymentMethodData) => {
    onNext(data);
  };

  const handleFakeCardSelect = (cardIndex: string) => {
    if (!cardIndex) return;

    const card = FAKE_CARDS[parseInt(cardIndex)];
    if (card) {
      form.setValue("type", card.type);
      form.setValue("card_number", card.card_number);
      form.setValue("expiry_month", card.expiry_month);
      form.setValue("expiry_year", card.expiry_year);
      form.setValue("cvv", card.cvv);
      form.setValue("cardholder_name", card.cardholder_name);
      setSelectedFakeCard(cardIndex);
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all spaces and non-digits
    const cleaned = value.replace(/\D/g, "");
    // Add spaces every 4 digits
    return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>
            Choose your payment method to complete the order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Test Cards */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Quick Test Cards (For Development)
            </label>
            <div className="grid gap-2">
              {FAKE_CARDS.map((card, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={
                    selectedFakeCard === index.toString()
                      ? "default"
                      : "outline"
                  }
                  className="justify-start h-auto p-3"
                  onClick={() => handleFakeCardSelect(index.toString())}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">{card.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {card.card_number} • {card.cardholder_name}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {card.type}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or enter manually
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Card Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select card type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Card Number */}
              <FormField
                control={form.control}
                name="card_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        maxLength={19}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cardholder Name */}
              <FormField
                control={form.control}
                name="cardholder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expiry Date and CVV */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="expiry_month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0");
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiry_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (2024 + i).toString();
                            return (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          {...field}
                          maxLength={4}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  This is a test environment. No real charges will be made.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Continue to Review
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
