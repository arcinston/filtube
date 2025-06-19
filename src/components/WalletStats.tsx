'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, HardDrive, Clock, CheckCircle } from 'lucide-react';

interface WalletStatsProps {
  className?: string;
}

export function WalletStats({ className }: WalletStatsProps) {
  // Mock data - in a real app, this would come from the blockchain/API
  const walletData = {
    filBalance: 100,
    usdcBalance: 204.871,
    pandoraBalance: 0.029,
    rateAllowance: 10, // GB
    storageUsage: 0, // GB
    maxStorage: 10, // GB
    persistenceDaysAtMax: 30.0,
    persistenceDaysAtCurrent: 2457590.3,
    rateAllowanceStatus: 'sufficient' as const,
    lockupAllowanceStatus: 'sufficient' as const,
  };

  const formatNumber = (num: number, decimals = 3) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(decimals);
  };

  const formatDays = (days: number) => {
    if (days > 1000000) {
      return `${formatNumber(days, 1)} days`;
    }
    return `${days.toFixed(1)} days`;
  };

  return (
    <div className={className}>
      {/* Wallet Balances */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Balances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground">FIL Balance</span>
              <span className="font-semibold">{walletData.filBalance} FIL</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground">USDFC Balance</span>
              <span className="font-semibold">
                {walletData.usdcBalance} USDFC
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground">Pandora Balance</span>
              <span className="font-semibold">
                {walletData.pandoraBalance} USDFC
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground">Rate Allowance</span>
              <span className="font-semibold">
                {walletData.rateAllowance} GB
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Storage Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span className="text-muted-foreground">Storage Usage</span>
              <span className="font-semibold">
                {walletData.storageUsage} GB / {walletData.maxStorage} GB
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span className="text-muted-foreground">
                Persistence days left at max usage (max rate:{' '}
                {walletData.maxStorage} GB)
              </span>
              <span className="font-semibold">
                {formatDays(walletData.persistenceDaysAtMax)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span className="text-muted-foreground">
                Persistence days left at current usage (current rate:{' '}
                {walletData.storageUsage} GB)
              </span>
              <span className="font-semibold">
                {formatDays(walletData.persistenceDaysAtCurrent)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allowance Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Allowance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground">Rate Allowance</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600 capitalize">
                  {walletData.rateAllowanceStatus}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground">Lockup Allowance</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600 capitalize">
                  {walletData.lockupAllowanceStatus}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Balance Status Message */}
      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-700 dark:text-green-400">
            Your storage balance is sufficient for {walletData.maxStorage}GB of
            storage for {formatDays(walletData.persistenceDaysAtMax)}.
          </span>
        </div>
      </div>
    </div>
  );
}
