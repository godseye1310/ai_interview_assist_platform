"use client";
// import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";

// importing form-components from shadcn ui
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

// 1. Define your form schema.
const authFormSchema = (type: FormType) => {
	return z.object({
		name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
		email: z.string().email(),
		password: z.string().min(6),
	});
};

// 2. Define your form component.
// Use the useForm hook from react-hook-form to create a form.
const AuthForm = ({ type }: { type: FormType }) => {
	const formSchema = authFormSchema(type);
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const router = useRouter();

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.

		try {
			if (type === "sign-up") {
				// Sign up the user
				const { name, email, password } = values;

				const userCredentials = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				// console.log(userCredentials);

				const response = await signUp({
					uid: userCredentials.user.uid,
					name: name!,
					email,
					password,
				});

				if (!response?.success) {
					toast.error(response?.message);
					return;
				}

				toast.success("Account created successfully. Please sign in");
				router.push("/sign-in");
			} else {
				// Sign in the user
				const { email, password } = values;

				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);

				const idToken = await userCredential.user.getIdToken();
				if (!idToken) {
					toast.error("Sign in failed. Please try again.");
					return;
				}

				// console.log(userCredentials);
				const response = await signIn({
					idToken,
					email,
				});

				console.log(response);

				// if (!response?.success) {
				// 	toast.error(response?.message);
				// 	return;
				// }

				toast.success("Signed in successfully");
				router.push("/");
			}

			// console.log(values);
		} catch (error) {
			console.log(error);
			toast.error(`Error: ${error}`);
		}
	}

	const isSignIn = type === "sign-in";

	return (
		<div className="card-border lg:min-[556px]:">
			<div className=" flex flex-col gap-6 card py-6 px-10">
				<div className="flex flex-row gap-2 justify-center">
					<Image src="/logo.svg" alt="logo" width={38} height={32} />
					<h2 className="text-primary-100">AI Interview Assistant</h2>
				</div>
				<h3 className="">Practice job interview with AI</h3>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full space-y-6 mt-4 form"
					>
						{!isSignIn && (
							<FormField
								type="text"
								name="name"
								label="Name"
								placeholder="Enter your name"
								control={form.control}
							/>
						)}
						<FormField
							type="email"
							name="email"
							label="Email *"
							placeholder="Enter your email"
							control={form.control}
						/>
						<FormField
							type="password"
							name="password"
							label="Password *"
							placeholder="Enter your password"
							control={form.control}
						/>

						<Button className="btn" type="submit">
							{isSignIn ? "Sign In" : "Create an Account"}
						</Button>
					</form>
				</Form>

				<p className="text-center">
					{isSignIn
						? "Don't have an account? "
						: "Already have an account? "}
					<Link
						href={isSignIn ? "/sign-up" : "/sign-in"}
						className="font-bold text-user-primary ml-1"
					>
						{isSignIn ? "Sign Up" : "Sign In"}
					</Link>
				</p>
			</div>
		</div>
	);
};

export default AuthForm;
