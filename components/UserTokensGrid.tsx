import { paths } from 'interfaces/apiTypes'
import { FC } from 'react'
import LoadingCard from './LoadingCard'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import FormatEth from './FormatEth'
import { useInView } from 'react-intersection-observer'

type Props = {
  tokens: SWRInfiniteResponse<
    paths['/users/{user}/tokens']['get']['responses']['200']['schema'],
    any
  >
  viewRef: ReturnType<typeof useInView>['ref']
}

const UserTokensGrid: FC<Props> = ({ tokens, viewRef }) => {
  const { data, isValidating, size } = tokens

  // Reference: https://swr.vercel.app/examples/infinite-loading
  const mappedTokens = data ? data.map(({ tokens }) => tokens).flat() : []
  const isEmpty = mappedTokens.length === 0
  const didReactEnd = isEmpty || data?.[data.length - 1]?.tokens?.length === 0

  if (isEmpty) {
    return (
      <div className="grid justify-center text-xl font-semibold">No tokens</div>
    )
  }

  return (
    <div className="mx-auto mb-8 grid max-w-[2400px] gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {size === 1 && isValidating
        ? Array(20).map((_, index) => (
            <LoadingCard key={`loading-card-${index}`} />
          ))
        : mappedTokens?.map((token, idx) => (
            <Link
              key={`${token?.token?.name}${idx}`}
              href={`/${token?.token?.contract}/${token?.token?.tokenId}`}
            >
              <a className="group grid rounded-b-md bg-white shadow transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-black">
                <img
                  src={optimizeImage(token?.token?.image, 250)}
                  alt={`${token?.token?.collection?.name}`}
                  className="w-full"
                  width="250"
                  height="250"
                />
                <p className="mb-3 px-6 pt-4 text-lg lg:pt-3">
                  {token?.token?.name}
                </p>
                <div className="flex items-center justify-between px-6 pb-4 lg:pb-3">
                  <div>
                    <div className="text-sm uppercase text-neutral-500 dark:text-neutral-400">
                      Offer
                    </div>
                    <div>
                      <FormatEth
                        amount={token?.token?.topBuy?.value}
                        maximumFractionDigits={4}
                        logoWidth={7}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm uppercase text-neutral-500 dark:text-neutral-400">
                      Price
                    </div>
                    <div>
                      <FormatEth
                        amount={token?.ownership?.floorSellValue}
                        maximumFractionDigits={4}
                        logoWidth={7}
                      />
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
      {!didReactEnd &&
        Array(20)
          .fill(null)
          .map((_, index) => {
            if (index === 0) {
              return (
                <LoadingCard viewRef={viewRef} key={`loading-card-${index}`} />
              )
            }
            return <LoadingCard key={`loading-card-${index}`} />
          })}
    </div>
  )
}

export default UserTokensGrid