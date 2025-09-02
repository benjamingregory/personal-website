import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'

export const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the post',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Tags for the post',
      required: false,
    },
    series: {
      type: 'string',
      description: 'The series this post belongs to',
      required: false,
    },
    published: {
      type: 'boolean',
      default: true,
      description: 'Whether the post is published',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/${post._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (post) => {
        const parts = post._raw.flattenedPath.split('/')
        return parts[parts.length - 1]
      },
    },
    readingTime: {
      type: 'json',
      resolve: (post) => readingTime(post.body.raw),
    },
  },
}))

export default makeSource({
  contentDirPath: 'src/app',
  documentTypes: [BlogPost],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})