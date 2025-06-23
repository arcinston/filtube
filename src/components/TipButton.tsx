'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, X, HelpCircle } from 'lucide-react';
import { useWriteContract, useAccount, useChainId } from 'wagmi';
import { parseUnits } from 'viem';
import { toast } from 'sonner';

const usdfcContractAddress = '0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0';
const usdfcAbi = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const;

interface TipButtonProps {
  channelName: string;
  channelAvatar?: string;
}
const truncateAddress = (address: string) => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
export function TipButton({ channelName, channelAvatar }: TipButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [message, setMessage] = useState('');
  const [sliderValue, setSliderValue] = useState(0);

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContract, isPending: isSendingTip } = useWriteContract();

  const customAmountId = useId();
  const tipMessageId = useId();
  const sliderId = useId();
  const predefinedAmounts = [5, 10, 25, 50, 100, 200, 500, 1000];

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    if (value >= 0 && value < predefinedAmounts.length) {
      setTipAmount(predefinedAmounts[value].toString());
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setTipAmount(amount);

    const index = predefinedAmounts.findIndex((p) => p.toString() === amount);
    setSliderValue(index); // will be -1 if not found
  };

  const handleSendTip = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first.');
      return;
    }

    // Calibration testnet chain id is 314159
    if (chainId !== 314159) {
      toast.error('Please switch to the Calibration testnet to send a tip.');
      return;
    }

    const amount = Number.parseFloat(tipAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid tip amount.');
      return;
    }

    writeContract(
      {
        address: usdfcContractAddress,
        abi: usdfcAbi,
        functionName: 'transfer',
        args: [channelName as `0x${string}`, parseUnits(tipAmount, 18)],
      },
      {
        onSuccess: (txHash) => {
          toast.success('Tip sent successfully!', {
            description: `Transaction: ${txHash}`,
          });
          setIsModalOpen(false);
          setTipAmount('');
          setMessage('');
          setSliderValue(0);
        },
        onError: (error) => {
          toast.error('Failed to send tip', {
            description: error.message,
          });
        },
      },
    );
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2"
      >
        <Heart className="w-4 h-4" />
        Tip
      </Button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md mx-4">
            <Card className="border-0 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    Thank {truncateAddress(channelName)} - FilTube
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Buy a Super Thanks, which directly supports{' '}
                  {truncateAddress(channelName)}.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Bonus Section */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Bonus
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                      {channelAvatar ? (
                        <img
                          src={channelAvatar}
                          alt={channelName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                          {channelName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          @{truncateAddress(channelName)}
                        </span>
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          ${tipAmount || '0'}.00
                        </span>
                        <span className="text-sm">Thanks</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount Selection Slider */}
                <div className="space-y-4">
                  <div className="space-y-3 select-none">
                    <Label htmlFor={sliderId}>Select Amount</Label>
                    <div className="relative px-3 select-none">
                      {/* Slider Track */}
                      <div className="relative h-2 bg-gradient-to-r from-cyan-400 via-yellow-400 via-orange-400 to-red-400 rounded-full">
                        <input
                          id={sliderId}
                          type="range"
                          min="0"
                          max={predefinedAmounts.length - 1}
                          step="1"
                          value={sliderValue}
                          onChange={(e) =>
                            handleSliderChange(Number.parseInt(e.target.value))
                          }
                          className="absolute inset-0 w-full h-2 cursor-pointer z-20 opacity-0"
                          style={{ height: '24px', marginTop: '-6px' }}
                        />
                        {/* Slider Thumb */}
                        <div
                          className="absolute top-1/2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200 z-10"
                          style={{
                            left: `${(sliderValue / (predefinedAmounts.length - 1)) * 100}%`,
                          }}
                        />
                        {/* Anchor Points */}
                        {predefinedAmounts.map((amount, index) => (
                          <div
                            key={amount}
                            className="absolute top-1/2 w-3 h-3 bg-white border-2 border-gray-400 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none z-5"
                            style={{
                              left: `${(index / (predefinedAmounts.length - 1)) * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                      {/* Amount Labels */}
                      <div className="flex justify-between mt-2 px-1 select-none">
                        {predefinedAmounts.map((amount, index) => (
                          <span
                            key={amount}
                            className={`text-xs font-medium transition-colors pointer-events-none ${
                              sliderValue === index
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            ${amount}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Current Selection Display */}
                    <div className="text-center select-none">
                      <span className="text-lg font-semibold text-foreground">
                        ${tipAmount || '0'}
                      </span>
                    </div>
                  </div>

                  {/* Custom Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor={customAmountId}>Custom Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        id={customAmountId}
                        type="number"
                        placeholder="0.00"
                        value={tipAmount}
                        onChange={handleCustomAmountChange}
                        className="pl-7"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <Label htmlFor={tipMessageId}>Message (Optional)</Label>
                    <Textarea
                      id={tipMessageId}
                      placeholder="Add a message to your tip..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">
                      {message.length}/200 characters
                    </p>
                  </div>
                </div>

                {/* Info Text */}
                <div className="text-xs text-muted-foreground">
                  <p>
                    As an added bonus, the above public comment will be
                    published on your behalf (subject to Community Guidelines).{' '}
                    <span className="text-blue-500 hover:underline cursor-pointer">
                      Learn more
                    </span>
                  </p>
                </div>

                {/* Send Button */}
                <Button
                  className="w-full"
                  onClick={handleSendTip}
                  disabled={
                    !tipAmount ||
                    Number.parseFloat(tipAmount) <= 0 ||
                    isSendingTip
                  }
                >
                  {isSendingTip ? 'Sending...' : 'Buy and Send'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
