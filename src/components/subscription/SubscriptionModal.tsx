import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { SubscribeButton } from './SubscribeButton'

type SubscriptionModalProps = {
  isOpen: boolean
  onClose: () => void
}

const benefits = [
  'Access to premium herb database',
  'Exclusive herbal remedy recipes',
  'Priority support from herbalists',
  'Ad-free experience',
  'Early access to new features',
]

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900">
                      Unlock Full Benefits
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-lg text-gray-900 font-medium">
                        Get unlimited access for just $1.99/week!
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Join thousands of herbal enthusiasts who have already upgraded their experience.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="text-sm font-medium text-gray-900">What's included:</h4>
                      <ul className="mt-4 space-y-3">
                        {benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0">
                              <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                            </div>
                            <p className="ml-3 text-sm text-gray-700">{benefit}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse">
                  <SubscribeButton />
                  <button
                    type="button"
                    className="mt-3 sm:mt-0 sm:mr-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                    onClick={onClose}
                  >
                    Maybe Later
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
