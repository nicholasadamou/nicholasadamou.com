import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "react-hot-toast";

const formSchema = z.object({
  username: z.string().min(1, "GitHub username is required"),
  email: z.string().email("Invalid email address"),
});

type FormSchema = z.infer<typeof formSchema>;

interface SourceCodeFormProps {
  onSubmit: SubmitHandler<FormSchema>;
}

export default function SourceCodeForm({ onSubmit }: SourceCodeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  return (
    <section>
      <h3 className="mb-0 text-lg font-medium">Source code</h3>
      <p className="mt-2 text-sm text-zinc-500">
        Enter your GitHub username and email to access the source code.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-3 sm:flex-row sm:items-center"
      >
        <div className="w-full sm:flex-1">
          <input
            type="text"
            placeholder="GitHub username"
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-0.5 placeholder:text-sm dark:border-zinc-600"
            {...register("username")}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="w-full sm:flex-1">
          <input
            type="email"
            placeholder="GitHub email"
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-0.5 placeholder:text-sm dark:border-zinc-600"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-[#2b303b] px-5 py-1.5 text-sm text-white transition-all hover:bg-[#2b303b]/75 dark:bg-white dark:text-[#2b303b] dark:hover:bg-[#2b303b] dark:hover:text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Get source code"}
        </button>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
}
