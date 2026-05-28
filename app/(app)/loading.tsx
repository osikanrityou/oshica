import { ListSkeleton } from "@/components/shared/ListSkeleton";
import { MobilePage } from "@/components/layout/MobilePage";

export default function AppLoading() {
  return (
    <MobilePage>
      <ListSkeleton count={4} />
    </MobilePage>
  );
}
