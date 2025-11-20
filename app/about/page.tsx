import { title } from "@/components/primitives";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Heart, Mail, Coffee } from "lucide-react";
import { Impressum } from "@/components/Impressum";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-default-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={title({ size: "lg", color: "foreground" })}>
              About Food Truck Finder
            </h1>
            <p className="text-lg text-default-600 mt-4 max-w-2xl mx-auto">
              Connecting food lovers with amazing mobile cuisine experiences
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* About Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-default-50 dark:from-default-100 dark:to-default-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Coffee className="text-primary" size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Our Mission</h2>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-default-600 leading-relaxed">
                  This is a free-to-use food truck finder app powered by the{" "}
                  <Link href="https://craftplaces.com" target="_blank" className="text-primary font-medium">
                    Craftplaces.com
                  </Link>{" "}
                  API. We&apos;re passionate about helping you discover amazing local food trucks and supporting mobile food vendors in your community.
                </p>
              </CardBody>
            </Card>

            {/* Support Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-danger/10 rounded-lg">
                    <Heart className="text-danger" size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Support This Project</h2>
                </div>
              </CardHeader>
              <CardBody className="pt-0 space-y-4">
                <p className="text-default-600 leading-relaxed">
                  Help keep this service running! Server costs are €5/month, and your support helps maintain and improve the platform for everyone.
                </p>
                <Button
                  as={Link}
                  href="https://patreon.com/JUULdog"
                  target="_blank"
                  color="primary"
                  variant="flat"
                  startContent={<Heart size={18} />}
                  className="w-full"
                >
                  Support on Patreon - €1/month
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Contact Section */}
          <Impressum />

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-bold text-lg mb-2">Real-time Updates</h3>
              <p className="text-sm text-default-600">Fresh data updated daily from trusted sources</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-secondary/5 border border-secondary/20">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-lg mb-2">Location Mapping</h3>
              <p className="text-sm text-default-600">Easy navigation to your favorite food trucks</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-success/5 border border-success/20">
              <div className="text-3xl mb-3">💳</div>
              <h3 className="font-bold text-lg mb-2">Payment Info</h3>
              <p className="text-sm text-default-600">Know accepted payment methods before you go</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}