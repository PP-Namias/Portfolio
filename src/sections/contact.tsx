import { useContact } from "@/hooks/use-contact";
import { Input, Textarea, Button, addToast } from "@heroui/react";
import { ArrowDownLeft, MapPin } from "lucide-react";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { contactFormSchema as formSchema } from "@/constants/form-schemas/contact";
import { useCallback } from "react";

export const Contact = () => {
  const { sendMessageMutation } = useContact();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      await sendMessageMutation.mutateAsync(value).then(({ error }) => {
        if (!error) {
          addToast({
            title: "Message has been set successfuly!",
            color: "success",
          });
          form.reset();
        } else {
          addToast({
            title: "An error has occured.",
            color: "danger",
          });
        }
      });
    },
  });

  const getFieldError = useCallback((field: AnyFieldApi) => {
    const { isTouched, isValid, errors } = field.state.meta;
    const isInvalid = isTouched && !isValid;

    const errorMessage = isInvalid
      ? errors
          ?.map((e) => e?.message)
          .filter(Boolean)
          .join(", ")
      : "";

    return { isInvalid, errorMessage };
  }, []);

  return (
    <>
      <div className="" id="ContactSection">
        <div className="grid gap-2 sm:gap-4">
          <div className="bg-background space-y-2 rounded-xl sm:space-y-4">
            <div className="relative p-[3px] sm:p-0">
              <div className="border-default relative space-y-1 rounded-xl p-4 px-6 md:p-6 md:px-8 lg:p-5 lg:px-7 2xl:p-6 2xl:px-8">
                <p className="text-3xl font-bold sm:text-4xl 2xl:text-[2.8rem]">
                  Get in touch.
                </p>
                <p className="text-xs sm:text-base xl:text-sm 2xl:text-lg">
                  Considering to be in contact with me regarding a project?
                  Perhaps collaboration? Or just about anything?
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background relative rounded-xl p-[3px] sm:p-0">
            <div className="absolute right-2 bottom-[-10px] z-20">
              <div className="relative">
                <div className="border-primary dark:border-foreground absolute inset-0 flex h-full w-full animate-ping rounded-full border"></div>
                <div className="border-primary bg-background text-primary rounded-full border">
                  <ArrowDownLeft size={30} className="" />
                </div>
              </div>
            </div>
            <div className="bg-background border-default space-y-4 rounded-xl border p-6 px-8 text-xs sm:text-base xl:text-sm 2xl:text-base">
              <div className="space-y-4">
                <p className="">
                  With proven freelancing and professional experience across
                  diverse projects, I’ve consistently delivered tailored
                  solutions that exceed expectations. Having grown from
                  independent work into formal roles, I bring adaptability,
                  technical expertise, and the drive to excel in challenging
                  opportunities that align with my interests and strengths.
                </p>
                <p className="">
                  Sincerely, a tea-powered programmer fueled by curiosity and
                  continuous growth.
                </p>
              </div>

              <div className="text-primary flex items-center gap-4">
                <MapPin size={18} />
                <p className="font-bold">Currently based in the Philippines</p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-xl p-[3px] sm:p-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="bg-background border-default space-y-4 rounded-xl border p-6 px-8">
                <p className="text-primary dark:text-foreground text-lg font-bold sm:text-xl 2xl:text-2xl">
                  Send me a message!
                </p>
                <div className="space-y-3">
                  <form.Field
                    name="email"
                    children={(field) => {
                      const { isInvalid, errorMessage } = getFieldError(field);

                      return (
                        <Input
                          id={field.name}
                          size="sm"
                          name={field.name}
                          label={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          isInvalid={isInvalid}
                          errorMessage={errorMessage}
                          classNames={{ label: "capitalize" }}
                        />
                      );
                    }}
                  />
                  <form.Field
                    name="name"
                    children={(field) => {
                      const { isInvalid, errorMessage } = getFieldError(field);

                      return (
                        <Input
                          id={field.name}
                          size="sm"
                          name={field.name}
                          label={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          isInvalid={isInvalid}
                          errorMessage={errorMessage}
                          classNames={{ label: "capitalize" }}
                        />
                      );
                    }}
                  />
                  <form.Field
                    name="message"
                    children={(field) => {
                      const { isInvalid, errorMessage } = getFieldError(field);

                      return (
                        <Textarea
                          id={field.name}
                          size="sm"
                          name={field.name}
                          label={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          isInvalid={isInvalid}
                          errorMessage={errorMessage}
                          classNames={{ label: "capitalize" }}
                        />
                      );
                    }}
                  />
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                      <Button
                        color="primary"
                        type="submit"
                        isDisabled={!canSubmit}
                        isLoading={isSubmitting}
                      >
                        {isSubmitting ? "" : "Submit"}
                      </Button>
                    )}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
