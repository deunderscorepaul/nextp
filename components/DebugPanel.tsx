import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Code } from '@nextui-org/code';
import { Divider } from '@nextui-org/divider';
import { Bug, Database, Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface DebugPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  trucksCount: number;
  lastFetch: Date | null;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  isVisible,
  onToggle,
  trucksCount,
  lastFetch
}) => {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('online');

  const checkApiStatus = async () => {
    setApiStatus('checking');
    try {
      const response = await fetch('/result.json');
      setApiStatus(response.ok ? 'online' : 'offline');
    } catch {
      setApiStatus('offline');
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          color="warning"
          variant="flat"
          size="sm"
          startContent={<Bug size={16} />}
          className="shadow-lg"
        >
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-xl border border-warning/20 bg-background/95 backdrop-blur-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Bug className="text-warning" size={20} />
              <h3 className="font-bold text-warning">Debug Panel</h3>
            </div>
            <Button
              onClick={onToggle}
              size="sm"
              variant="light"
              className="min-w-unit-8 w-unit-8 h-unit-8"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-3">
          {/* Environment Info */}
          <div>
            <p className="text-sm font-medium mb-2">Environment</p>
            <Chip size="sm" color="warning" variant="flat">
              Development Mode
            </Chip>
          </div>

          <Divider />

          {/* Data Status */}
          <div>
            <p className="text-sm font-medium mb-2">Data Status</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">Trucks Loaded:</span>
                <Chip size="sm" color="success" variant="flat">
                  {trucksCount}
                </Chip>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">Last Fetch:</span>
                <span className="text-xs text-default-500">
                  {lastFetch ? lastFetch.toLocaleTimeString() : 'Never'}
                </span>
              </div>
            </div>
          </div>

          <Divider />

          {/* API Status */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">API Status</p>
              <Button
                onClick={checkApiStatus}
                size="sm"
                variant="light"
                startContent={<RefreshCw size={14} />}
                isLoading={apiStatus === 'checking'}
              >
                Check
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {apiStatus === 'online' ? (
                <Wifi className="text-success" size={16} />
              ) : (
                <WifiOff className="text-danger" size={16} />
              )}
              <Chip
                size="sm"
                color={apiStatus === 'online' ? 'success' : 'danger'}
                variant="flat"
              >
                {apiStatus === 'checking' ? 'Checking...' : apiStatus}
              </Chip>
            </div>
          </div>

          <Divider />

          {/* Mock Data Info */}
          <div>
            <p className="text-sm font-medium mb-2">Mock Data</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-primary" />
                <span className="text-xs text-default-600">Using generated mock trucks</span>
              </div>
              <Code size="sm" className="text-xs">
                mockTrucks.length: {trucksCount}
              </Code>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <p className="text-sm font-medium mb-2">Quick Actions</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="secondary"
                onClick={() => console.log('Debug info logged')}
              >
                Log Data
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};