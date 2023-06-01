"use client";

import {signIn} from 'next-auth/react';
import {FcGoogle} from 'react-icons/fc';
import { AiFillGithub } from "react-icons/ai";
import {useCallback, useState} from 'react';
import { FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import toast from 'react-hot-toast';
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from 'next/navigation';

const LoginModal = () => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: {
        errors,
    },
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        
        signIn('credentials', {
            ...data,
            redirect: false,
        })
        .then((callback)=> {
            setIsLoading(false);

            if(callback?.ok) {
                toast.success('Logged in');
                router.refresh();
                loginModal.onClose();
            } 

            if(callback?.error){
                toast.error(callback.error)
            }
        })
    }

    const onToggle = useCallback(() => {
        loginModal.onClose();
    }, [loginModal])

    const bodyContent = (
        <div className=" flex flex-col gap-4">
            <Heading  title="Welcome to Airbnb" subtitle="Login to your Account!" />
            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                label="Password"
                type="password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
          <hr />
          <Button 
            outline 
            label="Continue with Google"
            icon={FcGoogle}
            onClick={() => ({})} 
          />
          <Button 
            outline 
            label="Continue with Github"
            icon={AiFillGithub}
            onClick={() => ({})} 
          />
          <div 
            className="
              text-neutral-500 
              text-center 
              mt-4 
              font-light
            "
          >
            <p>Already have an account?
              <span 
                onClick={onToggle} 
                className="
                  text-neutral-800
                  cursor-pointer 
                  hover:underline
                "
                > Log in</span>
            </p>
          </div>
        </div>
      )

    return (
        <div>
            <Modal 
                disabled={isLoading}
                isOpen={loginModal.isOpen}
                onClose={loginModal.onClose}
                title="Login"
                actionLabel="Continue"
                onSubmit={handleSubmit(onSubmit)}
                body={bodyContent}
                footer={footerContent}
             />
        </div>
    );
}
 
export default LoginModal;