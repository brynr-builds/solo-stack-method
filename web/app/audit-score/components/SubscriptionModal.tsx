import React from 'react';
import Link from 'next/link';

interface SubscriptionModalProps {
  showRunModal: boolean;
  isSubscribed: boolean;
  setShowRunModal: (show: boolean) => void;
}

export function SubscriptionModal({ showRunModal, isSubscribed, setShowRunModal }: SubscriptionModalProps) {
  if (!showRunModal || isSubscribed) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Score Access</h2>
        <p className="text-gray-600 mb-6">
          Viewing is free. Acting requires a subscription.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="text-4xl font-bold text-solo-primary mb-1">$20</div>
          <div className="text-gray-500 mb-4">per month</div>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Run unlimited audits</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Generate fix prompts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Full execution access</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/signup"
            className="block w-full py-3 bg-solo-accent text-white text-center rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Subscribe Now
          </Link>
          <button
            onClick={() => setShowRunModal(false)}
            className="block w-full py-3 text-gray-600 text-center hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
