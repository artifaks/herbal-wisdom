import { SubscribeButton } from '@/components/subscription/SubscribeButton';

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Premium Subscription
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Get access to all premium features and content with our monthly subscription.
                </p>
              </div>
              <div className="mt-5">
                <SubscribeButton />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access to all premium content</li>
                  <li>Exclusive herbal wisdom resources</li>
                  <li>Priority support</li>
                  <li>Cancel anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
