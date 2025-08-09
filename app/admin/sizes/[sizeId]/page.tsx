import { notFound } from "next/navigation";
import { getSizeDetails } from "@/features/sizes/actions/sizes.actions";
import { SizeDetailView } from "@/features/sizes/components/size-detail-view";

interface SizeDetailPageProps {
  params: {
    sizeId: string;
  };
}

const SizeDetailPage = async ({ params }: SizeDetailPageProps) => {
  const size = await getSizeDetails(params.sizeId);

  if (!size) {
    notFound();
  }

  return <SizeDetailView size={size} />;
};

export default SizeDetailPage;
