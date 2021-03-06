import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Error from 'next/error';
import Layout from '@components/Layout';
import useSWR, { mutate } from 'swr';
import Menu from '@components/dashboard/DashMenu';
import { useUser } from '@lib/wrapper/useUser';
import { fetcher } from '@lib/fetcher';
import { withPageAuthRequired } from '@lib/wrapper/withPageAuth';
import { FormDataProps } from '~types/forms';
import { ViewResponseModal } from '@components/modals/view-response';
import { FormResponseProps, ResponseRefProps } from '~types/responses';
import { UserLoading } from '@components/loading/user';
import { toast } from 'react-toastify';
import { ToastWrapper } from '@components/toast';
import { TrashIcon } from '@heroicons/react/outline';

const FormReponses = withPageAuthRequired(() => {
  const { user } = useUser();

  const [view, setView] = useState<boolean>(false);
  const [viewResponse, setViewResponse] = useState<FormResponseProps>(null);

  const [delRefID, setDelRefID] = useState<string>(null);
  const [deleted, setDeleted] = useState<boolean>(false);

  // get {formid} from router
  const router = useRouter();
  const { formid } = router.query;
  const [responses, setResponses] = useState<object[]>(null);
  const [form, setForm] = useState<FormDataProps>();

  // main functions
  const handleViewResponse = (f: FormResponseProps) => {
    setView(true);
    setViewResponse(f);
  };

  const handleRemoveResponse = async (f: ResponseRefProps) => {
    toast.info('Removing response...');
    var tf = responses;
    tf.splice(tf.indexOf(f), 1);

    setDelRefID(f.ref['@ref'].id);
    setResponses(tf);
    setDeleted(true);
  };

  useEffect(() => {
    if (deleted) {
      fetch('/api/user/forms/get/responses/remove', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formid: formid,
          respID: delRefID
        })
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.deleted) {
            mutate(`/api/user/forms/get/responses/${formid}`);

            toast.success('Successfully removed response...');

            setDeleted(false);
            setDelRefID(null);
          } else {
            // TODO::
            // item was not deleted
          }
        });
    }
  }, [deleted, delRefID, formid]);

  // get form responses
  const { data } = useSWR(formid ? `/api/user/forms/get/responses/${formid}` : null, fetcher);

  useEffect(() => {
    if (data) {
      if (!data.error && data.formExists) {
        setResponses(data.responses.data);
        setForm(data.form);
      }
    }
  }, [data]);

  if (data) {
    if (!data.formExists) {
      return <Error statusCode={404} />;
    }
  }

  if (!data) return <UserLoading />;

  return (
    <>
      <ToastWrapper />

      {user && form && (
        <Layout title={`${form.name} | Form Responses`}>
          <ViewResponseModal
            open={view}
            setOpen={setView}
            response={viewResponse}
            formFields={form.fields}
          />

          <Menu />

          <div className="w-5/6 mx-auto my-8">
            <h3 className="text-2xl">
              <Link href={`/user/dashboard/forms/${formid}`}>
                <a className="font-extrabold text-teal-500 hover:underline">{form.name}</a>
              </Link>{' '}
              | <span className="text-xl">Responses</span>
            </h3>
            <hr className="my-6" />

            {responses && (
              <div className="py-4 px-8">
                {responses.length > 0 ? (
                  <ul>
                    {responses.map((resp: ResponseRefProps, index) => (
                      <li
                        key={index}
                        className="group p-4 hover:border-teal-600 border rounded-md my-2"
                      >
                        <div className="w-full flex items-center justify-between text-gray-800">
                          <button
                            onClick={() => handleViewResponse(resp.data)}
                            className="group-hover:text-teal-600"
                          >
                            {resp.data.data.responseId}
                          </button>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-600">
                              {new Date(resp.data.data.date).toUTCString()} |
                            </p>
                            <button
                              onClick={() => handleRemoveResponse(resp)}
                              className="ml-2 hover:text-rose-500"
                              title="Remove Response"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No responses yet...</p>
                )}
              </div>
            )}
          </div>
        </Layout>
      )}
    </>
  );
});

export default FormReponses;
