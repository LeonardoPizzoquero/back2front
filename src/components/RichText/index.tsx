import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ReactQuillProps } from 'react-quill';
import hljs from 'highlight.js';

import 'react-quill/dist/quill.snow.css';
import 'highlight.js/styles/tokyo-night-dark.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type RichTextProps = ReactQuillProps;

const RichText = ({ ...rest }: RichTextProps) => {
  const [value, setValue] = useState('');

  hljs.configure({
    languages: ['javascript', 'ruby', 'python', 'json'],
  });

  return (
    <div>
      <ReactQuill
        style={{
          height: 1600,
          background: '#FFF',
        }}
        preserveWhitespace
        modules={{
          syntax: true,
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ script: 'sub' }, { script: 'super' }],
            [{ font: [] }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            [
              'blockquote',
              'code-block',
              {
                color: [],
              },
              {
                background: [],
              },
            ],
            ['clean'],
          ],
        }}
        formats={[
          'header',
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          'list',
          'bullet',
          'indent',
          'code-block',
          'link',
          'image',
          'color',
          'background',
        ]}
        theme="snow"
        value={value}
        onChange={setValue}
        {...rest}
      />
    </div>
  );
};

export default RichText;
