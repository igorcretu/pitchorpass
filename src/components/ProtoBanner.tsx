interface Props {
  message: string
}

export function ProtoBanner({ message }: Props) {
  return (
    <div className="proto-banner">
      <div className="proto-banner-dot" />
      <p dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  )
}
