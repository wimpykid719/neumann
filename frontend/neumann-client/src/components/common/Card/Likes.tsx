import HurtIcon from '../icon/HurtIcon'

type LikesProps = {
  likes: number
}

export default function Likes({ likes }: LikesProps) {
  return (
    <span className='inline-flex items-center rounded-lg h-6 sub-bg-color shadow px-2.5 text-xs dark:border dark:border-gray-600 absolute top-32 left-16'>
      <span className='inline-block w-5 text-primary'>
        <HurtIcon width={14} height={14} />
      </span>
      {likes}
    </span>
  )
}
