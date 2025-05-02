import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Lock, NoteText, User } from "iconsax-reactjs";
// اعتبارسنجی با Zod
const schema = z.object({
  username: z.string().min(1, "یوزرنیم نمی‌تواند خالی باشد"),
  password: z.string().min(6, "پسورد باید حداقل 6 کاراکتر باشد"),
  fileNumber: z.string().min(1, "شماره پرونده نمی‌تواند خالی باشد"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // ذخیره کردن اطلاعات در localStorage
    localStorage.setItem("username", data.username);
    localStorage.setItem("password", data.password);
    localStorage.setItem("fileNumber", data.fileNumber);
    alert("اطلاعات با موفقیت ذخیره شد!");
    navigate("/recording");
  };

  return (
    <div className="  flex items-center justify-center w-[400px] h-[400px] p-5   rounded-xl  max-w-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4  flex flex-col items-end justify-center"
      >
        {/* فیلد یوزرنیم */}
        <div className="relative flex items-end flex-col gap-3">
          <div className="flex items-center justify-center gap-1">
            <input
              type="text"
              {...register("username")}
              placeholder="نام و نام خانوادگی خود را وارد کنید"
              className={`w-[300px] text-right text-xs p-3 border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />

            <User />
          </div>
          {errors.username && (
            <span className="text-red-500 text-xs absolute bottom-0 mt-3 left-0">
              {errors.username.message}
            </span>
          )}
        </div>

        {/* فیلد پسورد */}
        <div className="relative  flex items-end flex-col gap-3">
          <div className="flex items-center justify-center gap-1">
            <input
              type="password"
              {...register("password")}
              placeholder="پسورد خود را وارد کنید"
              className={` p-3 text-right w-[200px] text-xs border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <Lock />
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs absolute bottom-0 left-0">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* فیلد شماره پرونده */}
        <div className="relative  flex items-end flex-col gap-3">
        <div className="flex items-center justify-center gap-1">
          <input
            type="text"
            {...register("fileNumber")}
            placeholder="شماره پرونده "
            className={` text-right  text-xs p-3 border-2 rounded-lg transition-all duration-300 focus:outline-none ${
              errors.fileNumber ? "border-red-500" : "border-gray-300"
            }`}
          />

          <NoteText />
          </div>
          {errors.fileNumber && (
            <span className="text-red-500 text-xs absolute bottom-0 left-0 ">
              {errors.fileNumber.message}
            </span>
          )}
        </div>

        {/* دکمه ورود */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-400 text-black rounded-lg font-semibold transition-all duration-300 "
        >
          ورود
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
