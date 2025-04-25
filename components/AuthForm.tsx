/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	createUserWithEmailAndPassword,
	GithubAuthProvider,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
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
import {
	signIn,
	signInUserWithProvider,
	signUp,
} from "@/lib/actions/auth.action";

// 1. Define your form schema.
const authFormSchema = (type: FormType) => {
	return z.object({
		name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
		email: z.string().email(),
		password: z.string().min(6),
	});
};

const LAST_REFRESH_KEY = "lastSessionRefresh";

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

	// 2. Define a Form submit handler for Auth Form.
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
				// providerId is null because we are using email and password
				const response = await signUp({
					uid: userCredentials.user.uid,
					name: name!,
					email,
					password,
				});

				if (!response?.success) {
					throw new Error(response?.message);
				}
				toast.success(response?.message);
				router.push("/sign-in");
				//
			} else {
				// Sign in the user
				const { email, password } = values;

				const userCredentials = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				// console.log(userCredentials.user);
				const idToken = await userCredentials.user.getIdToken();

				if (!idToken) {
					throw new Error("Sign in failed. Please try again.");
				}

				const response = await signIn({
					idToken,
					uid: userCredentials.user.uid,
					email,
				});

				if (!response?.success) {
					throw new Error(response?.message);
				}
				localStorage.setItem(LAST_REFRESH_KEY, Date.now().toString());
				toast.success("Signed in successfully");
				router.push("/home");
			}
			// console.log(values);
			//
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log(error);
			console.log(error.code);
			let message = error?.message;
			if (error.code === "auth/email-already-in-use") {
				message = "Email already in use";
			}
			if (error.code === "auth/invalid-credential") {
				message = "Check your email and password";
			}
			if (error.code === "auth/network-request-failed") {
				message = "Network error. Please try again later";
			} else {
				message = "Something went wrong. Please try again later";
			}

			toast.error(`${message}`);
		}
	}

	const isSignIn = type === "sign-in";

	const handleGoogleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const userCredentials = await signInWithPopup(auth, provider);

			const idToken = await userCredentials.user.getIdToken();
			if (!idToken) {
				toast.error("Sign in failed. Please try again.");
				return;
			}
			// console.log(userCredentials);
			const { uid, displayName, email, photoURL } = userCredentials.user;

			const response = await signInUserWithProvider({
				idToken,
				uid,
				name: displayName!,
				email: email!,
				photoURL: photoURL!,
				providerId: userCredentials.providerId!,
			});
			console.log(response);

			if (!response?.success) {
				throw new Error(response?.message);
			}
			localStorage.setItem(LAST_REFRESH_KEY, Date.now().toString());
			toast.success(response?.message);
			router.push("/home");
			//
		} catch (error: any) {
			console.log(error);
			let message = "Error Signing in with Google";
			if (error?.code === "auth/network-request-failed") {
				message = "Network error. Please try again later";
				toast.error(`${message}`);
			}
			// toast.error(`Error Signing in with Google`);
			console.log(message);
		}
	};

	const handleGithubSignIn = async () => {
		const provider = new GithubAuthProvider();
		try {
			const userCredentials = await signInWithPopup(auth, provider);

			//console.log(userCredentials);

			const idToken = await userCredentials.user.getIdToken();
			if (!idToken) {
				toast.error("Sign in failed. Please try again.");
				return;
			}

			const { uid, displayName, email, photoURL } = userCredentials.user;

			const response = await signInUserWithProvider({
				idToken,
				uid,
				name: displayName!,
				email: email!,
				photoURL: photoURL!,
				providerId: userCredentials.providerId!,
			});
			// console.log(response);

			if (!response?.success) {
				throw new Error(response?.message);
			}
			localStorage.setItem(LAST_REFRESH_KEY, Date.now().toString());
			toast.success(response?.message);
			router.push("/home");
			//
		} catch (error: any) {
			console.log(error);
			let message = "Error Signing in with Github";
			if (error?.code === "auth/network-request-failed") {
				message = "Network error. Please try again later";
				toast.error(`${message}`);
			}
			// toast.error(`Error Signing in with Github`);
			console.log(message);
		}
	};

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
						className="font-bold text-user-primary ml-1 text-blue-500"
					>
						{isSignIn ? "Sign Up" : "Sign In"}
					</Link>
				</p>

				<div className="flex flex-row justify-between items-center">
					<hr className="flex-1/2" />
					<p className="text-center text-xs flex-1/5">OR</p>
					<hr className="flex-1/2" />
				</div>
				<p className="text-center text-sm">Continue with</p>
				<div className="flex flex-col md:flex-row gap-2 justify-center">
					<Button
						className="w-full md:w-1/2"
						type="button"
						onClick={handleGoogleSignIn}
					>
						Sign In with Google
					</Button>
					<Button
						className="w-full md:w-1/2"
						type="button"
						onClick={handleGithubSignIn}
					>
						Sign In with Github
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
