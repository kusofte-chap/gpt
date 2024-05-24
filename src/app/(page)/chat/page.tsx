
import Presentation from ".";
import PageFooter from "@/component/PageFooter";

export default function Home() {
  return (
    <div className="flex h-full flex-col focus-visible:outline-0" role='presentation'>
      <Presentation />
      {/* <PageFooter /> */}
    </div>
  );
}
