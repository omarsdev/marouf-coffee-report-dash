import {Checkbox, InputLabel} from '@mui/material'
import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import CustomSelect from 'components/CustomSelect'
import FormBottomWidget from 'components/FormBottomWidget'
import TextInput from 'components/TextInput'
import useForm from 'lib/hooks/useForm'
import router, {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import React, {useEffect} from 'react'
import Layout from '../../../Layout'
import Error from 'components/Error'
import {useQuery} from '@tanstack/react-query'
import {get} from 'lodash'
import {questionsApi} from 'lib/api/questions'
export default function QuestionsForm({setLoading}) {
  const {
    query: { model_id },
  } = useRouter();
  const isEditting = model_id.toString() !== "new";

  const [backendError, setBackendError] = React.useState<string>("");

  const { data: branch, isLoading: isLoadingChecklist } = useQuery<any>({
    queryFn: () => questionsApi.getId(model_id.toString()),
    enabled: isEditting,
    queryKey: ["questions" + model_id.toString()],
    select: (data) => {
      const chosenKeys = ["text"];
      chosenKeys.map((key) => handleChange(key, get(data?.report, key)));
      return data;
    },
  });

  const submitCreate = async () => {
    try {
      setLoading(true);
      await questionsApi.create({ ...values });
      router.back();
    } catch (e) {
      console.error(e);
      setBackendError(e?.message);
    } finally {
      setLoading(false);
    }
  };

  const submitUpdate = async () => {
    try {
      setLoading(true);
      await questionsApi.update(model_id.toString(), { ...values });
      router.back();
    } catch (e) {
      console.error(e);
      setBackendError(e?.message);
    } finally {
      setLoading(false);
    }
  };

  const { values, errors, handleChange, handleSubmit, clearErrors } = useForm({
    initial: {
      text: "",
      type: "MultipleChoice",
      media_status: "no_media",
      options: ["Yes", "No"],
      required: true,
    },
    onSubmit: isEditting ? submitUpdate : submitCreate,
  });

  useEffect(() => {
    setLoading(isLoadingChecklist);
  }, [isLoadingChecklist]);

  return (
    <Layout
      meta={{
        title: isEditting ? "Edit Question" : "Add Question",
      }}
    >
      <CustomLabel size="bigTitle">
        {isEditting ? "Edit Question" : "Add Question"}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {isEditting ? "Edit an existing Question" : "Create a new Question"}
      </CustomLabel>

      <CustomContainer
        style={{
          overflow: "hidden",
        }}
        className="overflow-hidden mb-14"
        radius="medium"
        type="secondary"
        padding={3}
      >
        {/* Text Input (Only visible input field) */}
        <TextInput
          label="Text"
          className="w-full"
          name="text"
          value={values.text}
          onChange={handleChange}
          padding={1}
        />

        {/* Hidden Inputs for default values */}
        <input type="hidden" name="type" value={values.type} />
        <input type="hidden" name="media_status" value={values.media_status} />
        <input type="hidden" name="options" value={values.options.join(",")} />
        <input type="hidden" name="required" value={values.required} />

        <Error backendError={backendError} />

        <FormBottomWidget
          isEdit={isEditting}
          onSubmit={() => {
            handleSubmit();
          }}
        />
      </CustomContainer>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx);
}
