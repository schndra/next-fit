import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/features/checkout/actions/order.actions";
import { OrdersList } from "@/features/checkout/components/orders-list";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/orders");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <OrdersList orders={orders} />
      </div>
    </div>
  );
}
