import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { getPosts, createPost } from '~/services/post.server';
import type { Post } from '~/services/post.server';
import { Post as PostComponent } from '~/components/Post';
import { PostForm } from '~/components/PostForm';
import { CreatePost } from '../../services/validations';
import { authenticator } from '../../services/auth.server';

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

type ActionData = {
  error?: {
    formError?: string[];
    fieldErrors?: {
      title?: string[];
      body?: string[];
    };
  };
  fields?: {
    title?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  const form = await request.formData();
  const rawTitle = form.get('title');
  const rawBody = form.get('body');
  const result = CreatePost.safeParse({ title: rawTitle, body: rawBody });

  if (!result.success) {
    return json(
      {
        error: result.error.flatten(),
        fields: {
          title: rawTitle,
          body: rawBody,
        },
      },
      { status: 400 }
    );
  }
  await createPost({
    title: result.data.title ?? null,
    body: result.data.body,
    authorId: user.id,
  });

  return redirect('/');
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, { failureRedirect: '/login' });
  const data: LoaderData = { posts: await getPosts() };
  return json(data);
};

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();
  const formData = useActionData<ActionData>();

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl">Remix Social</h1>
      <PostForm
        action="/?index"
        error={formData?.error}
        fields={formData?.fields}
      />
      <ul>
        {posts.map((post) => (
          <li key={post.title}>
            <PostComponent title={post?.title} authorName={post?.author?.email}>
              {post.body}
            </PostComponent>
          </li>
        ))}
      </ul>
    </div>
  );
}
