import type { Props } from './types';

function Post({ title, children }: Props) {
  return (
    <div className="flex flex-col p-6 max-w-md border rounded">
      {title && <h2 className="font-bold text-3xl text-gray-900">{title}</h2>}
      <p className="mt-4 text-lg text-gray-900">{children}</p>
    </div>
  );
}

export default Post;
