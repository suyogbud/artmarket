"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {toast} from "sonner";
import { cn } from "@/lib/utils";
import {
  TschemaValidator,
  schemaValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ZodError } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
    const searchParams = useSearchParams()
    const isSeller = searchParams.get('as') === 'seller'
    const origin = searchParams.get("origin")
    const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TschemaValidator>({
    resolver: zodResolver(schemaValidator),
  });


  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError:(err)=>{
      if(err.data?.code === "CONFLICT"){
        toast.error(
          'This email already exists.'
        )
        return
      }
      if(err instanceof ZodError){
        toast.error(err.issues[0].message)
        return
      }
      toast.error('Something Occured!!!')
    },
    onSuccess:({sentToEmail})=>{
      toast.success(`Email sent to ${sentToEmail}.`)
      router.push("/verify-email?to=" + sentToEmail)
    }
  });

  const onsubmit = ({ email, password }: TschemaValidator) => {
    mutate({ email, password });
  };
  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-bold">Sign in to your account</h1>
            <Link
              href="sign-up"
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
            >
              Don't have an account? Sign up 
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onsubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder="example@example.com"
                  />
                  {errors?.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    {...register("password")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                    placeholder="password"
                  />
                  {errors?.password&& <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <Button>Sign In</Button>
              </div>
            </form>
            <div className="relative">
                <div className="absolute inset-o flex items-center">
                    <span className="w-full border-t"/>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        or
                    </span>
                </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
