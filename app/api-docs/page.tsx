import dynamic from 'next/dynamic'

const SwaggerDocs = dynamic(() => import('./swagger'), { ssr: false })

export default function ApiDocsPage() {
  return <SwaggerDocs />
}