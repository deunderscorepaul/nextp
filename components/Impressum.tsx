import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/divider";
import { Mail, Phone, Globe, MapPin, Building, FileText } from "lucide-react";
import { impressumConfig, formatAddress, getContactInfo } from "@/config/impressum";

export const Impressum = () => {
  const contactInfo = getContactInfo(impressumConfig);
  const formattedAddress = formatAddress(impressumConfig);

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-default-50 to-default-100 dark:from-default-100 dark:to-default-200">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto">
          <div className="p-3 bg-primary/10 rounded-full inline-block mb-3">
            <FileText className="text-primary" size={24} />
          </div>
          <h2 className="text-xl font-bold">Impressum</h2>
          <p className="text-sm text-default-600 mt-1">Legal Information</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Company Information */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Building className="text-primary mt-1 flex-shrink-0" size={18} />
            <div>
              <p className="font-semibold text-default-800">{impressumConfig.name}</p>
              {impressumConfig.legal.responsibleForContent && (
                <p className="text-sm text-default-600">
                  Responsible for content: {impressumConfig.legal.responsibleForContent}
                </p>
              )}
            </div>
          </div>

          <Divider />

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin className="text-secondary mt-1 flex-shrink-0" size={18} />
            <div>
              <p className="font-medium text-default-700">Address</p>
              <p className="text-sm text-default-600">{formattedAddress}</p>
            </div>
          </div>

          <Divider />

          {/* Contact Information */}
          <div className="space-y-2">
            <p className="font-medium text-default-700 mb-3">Contact Information</p>
            
            <div className="flex items-center gap-3">
              <Mail className="text-success flex-shrink-0" size={16} />
              <Link 
                href={`mailto:${contactInfo.email}`} 
                className="text-sm text-success hover:text-success-600 transition-colors"
              >
                {contactInfo.email}
              </Link>
            </div>

            {contactInfo.phone && (
              <div className="flex items-center gap-3">
                <Phone className="text-warning flex-shrink-0" size={16} />
                <Link 
                  href={`tel:${contactInfo.phone}`} 
                  className="text-sm text-warning hover:text-warning-600 transition-colors"
                >
                  {contactInfo.phone}
                </Link>
              </div>
            )}

            {contactInfo.website && (
              <div className="flex items-center gap-3">
                <Globe className="text-primary flex-shrink-0" size={16} />
                <Link 
                  href={contactInfo.website} 
                  target="_blank"
                  className="text-sm text-primary hover:text-primary-600 transition-colors"
                >
                  {contactInfo.website}
                </Link>
              </div>
            )}
          </div>

          {/* Legal Information */}
          {(impressumConfig.legal.vatId || impressumConfig.legal.commercialRegister) && (
            <>
              <Divider />
              <div className="space-y-2">
                <p className="font-medium text-default-700">Legal Information</p>
                
                {impressumConfig.legal.vatId && (
                  <p className="text-sm text-default-600">
                    <span className="font-medium">VAT ID:</span> {impressumConfig.legal.vatId}
                  </p>
                )}
                
                {impressumConfig.legal.commercialRegister && (
                  <p className="text-sm text-default-600">
                    <span className="font-medium">Commercial Register:</span> {impressumConfig.legal.commercialRegister}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};