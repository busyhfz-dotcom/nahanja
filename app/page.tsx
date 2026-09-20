import HomeExperience from "@/components/HomeExperience";
import JsonLd from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <HomeExperience />
    </>
  );
}
