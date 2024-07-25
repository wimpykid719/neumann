'use server'

import { codeHighLight } from '@/lib/codeHighLight'
import { PhrasingContent, RootContent, RootContentMap } from 'mdast'
import Link from 'next/link'
import React, { FC } from 'react'
import { remark } from 'remark'
import remarkBreaks from 'remark-breaks'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'

type Props = {
  id: string
  className: string
  children: string
}

const parseMarkdown = remark().use(remarkFrontmatter).use(remarkGfm).use(remarkBreaks)

export const MarkdownRenderer: React.FC<Props> = async ({ id, className, children }) => {
  const mdastRoot = parseMarkdown.parse(children)
  await parseMarkdown.run(mdastRoot)

  return (
    <div id={id} className={className}>
      <NodesRenderer nodes={mdastRoot.children} />
    </div>
  )
}

const NodesRenderer: FC<{ nodes: RootContent[] }> = ({ nodes }) => {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'heading': {
        return <HeadingNode key={index} node={node} />
      }
      case 'text': {
        return <TextNode key={index} node={node} />
      }
      case 'paragraph': {
        return <ParagraphNode key={index} node={node} />
      }
      case 'inlineCode': {
        return <InlineCodeNode key={index} node={node} />
      }
      case 'blockquote': {
        return <BlockQuoteNode key={index} node={node} />
      }
      case 'break': {
        return <BreakNode key={index} />
      }
      case 'link': {
        return <LinkNode key={index} node={node} />
      }
      case 'list': {
        return <ListNode key={index} node={node} />
      }
      case 'listItem': {
        return <ListItemNode key={index} node={node} />
      }
      case 'strong': {
        return <StrongNode key={index} node={node} />
      }
      case 'image': {
        return <ImageNode key={index} node={node} />
      }
      case 'code': {
        return <CodeNode key={index} node={node} />
      }
      case 'delete': {
        return <DeleteNode key={index} node={node} />
      }
      case 'table': {
        return <TableNode key={index} node={node} />
      }
      case 'thematicBreak': {
        return <ThematicBreakNode key={index} node={node} />
      }
      case 'html': {
        return <HTMLNode key={index} node={node} />
      }

      default: {
        if (process.env.NODE_ENV === 'development') {
          return (
            <div key={index}>
              <p style={{ color: 'red' }}>Unknown node type: {node.type}</p>
              <pre>{JSON.stringify(node, null, 2)}</pre>
            </div>
          )
        } else {
          throw new Error(`Unknown node type: ${node.type}`)
        }
      }
    }
  })
}

const HeadingNode: FC<{ node: RootContentMap['heading'] }> = ({ node }) => {
  const Component = (
    {
      1: 'h1',
      2: 'h2',
      3: 'h3',
      4: 'h4',
      5: 'h5',
      6: 'h6',
    } as const
  )[node.depth]

  const childrenText = (function getChildrenText(children: PhrasingContent[]): string {
    return children.reduce((acc, child) => {
      if ('value' in child) {
        return acc + child.value
      }
      if ('children' in child) {
        return acc + getChildrenText(child.children)
      }
      return acc
    }, '')
  })(node.children)

  return (
    <Component id={encodeURIComponent(childrenText)}>
      <NodesRenderer nodes={node.children} />
    </Component>
  )
}

const TextNode: FC<{ node: RootContentMap['text'] }> = ({ node }) => {
  return (
    <>
      {node.value.split('\n').map((line, index, array) => (
        <React.Fragment key={index}>
          {line}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  )
}

const ParagraphNode: FC<{ node: RootContentMap['paragraph'] }> = ({ node }) => {
  return (
    <p>
      <NodesRenderer nodes={node.children} />
    </p>
  )
}

const InlineCodeNode: FC<{ node: RootContentMap['inlineCode'] }> = ({ node }) => {
  return <code className=''>{node.value}</code>
}

const BlockQuoteNode: FC<{ node: RootContentMap['blockquote'] }> = ({ node }) => {
  return (
    <blockquote>
      <NodesRenderer nodes={node.children} />
    </blockquote>
  )
}
const BreakNode: FC = () => {
  return <br />
}

const LinkNode: FC<{ node: RootContentMap['link'] }> = ({ node }) => {
  return node.url?.startsWith('/') ? (
    <Link href={node.url}>
      <NodesRenderer nodes={node.children} />
    </Link>
  ) : (
    <a className='' href={node.url} target='_blank' rel='noreferrer'>
      <NodesRenderer nodes={node.children} />
    </a>
  )
}

const ListNode: FC<{ node: RootContentMap['list'] }> = ({ node }) => {
  return node.ordered ? (
    <ol>
      <NodesRenderer nodes={node.children} />
    </ol>
  ) : (
    <ul>
      <NodesRenderer nodes={node.children} />
    </ul>
  )
}

const ListItemNode: FC<{ node: RootContentMap['listItem'] }> = ({ node }) => {
  if (node.children.length === 1 && node.children[0].type === 'paragraph') {
    return (
      <li>
        <NodesRenderer nodes={node.children[0].children} />
      </li>
    )
  }

  return (
    <li>
      <NodesRenderer nodes={node.children} />
    </li>
  )
}

const StrongNode: FC<{ node: RootContentMap['strong'] }> = ({ node }) => {
  return (
    <strong>
      <NodesRenderer nodes={node.children} />
    </strong>
  )
}

const ImageNode: FC<{ node: RootContentMap['image'] }> = ({ node }) => {
  return (
    <a href={node.url} target='_blank' rel='noreferrer'>
      <img src={node.url} alt={node.alt ?? ''} className='' />
    </a>
  )
}

const CodeNode: FC<{ node: RootContentMap['code'] }> = async ({ node }) => {
  const lang = node.lang ?? ''

  const highlighted = await codeHighLight(node.value, lang)

  return <div dangerouslySetInnerHTML={{ __html: highlighted }} />
}

const DeleteNode: FC<{ node: RootContentMap['delete'] }> = ({ node }) => {
  return (
    <del>
      <NodesRenderer nodes={node.children} />
    </del>
  )
}

const TableNode: FC<{ node: RootContentMap['table'] }> = ({ node }) => {
  const [headRow, ...bodyRows] = node.children
  return (
    <table>
      <thead>
        <tr>
          {headRow.children.map((cell, index) => (
            <th key={index} style={{ textAlign: node.align?.[index] ?? undefined }}>
              <NodesRenderer nodes={cell.children} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((row, index) => (
          <tr key={index}>
            {row.children.map((cell, index) => (
              <td key={index} style={{ textAlign: node.align?.[index] ?? undefined }}>
                <NodesRenderer nodes={cell.children} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const ThematicBreakNode: FC<{ node: RootContentMap['thematicBreak'] }> = () => {
  return <br />
}

const HTMLNode: FC<{ node: RootContentMap['html'] }> = ({ node }) => {
  return node.value
}
