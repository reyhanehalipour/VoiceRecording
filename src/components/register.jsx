
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Lock, NoteText, User, Profile2User } from "iconsax-reactjs";

const schema = z.object({
  fullName: z.string().min(1, "نام و نام خانوادگی الزامی است"),
  username: z.string().min(1, "یوزرنیم الزامی است"),
  password: z.string().min(6, "پسورد باید حداقل 6 کاراکتر باشد"),
  fileNumber: z.string().min(1, "شماره پرونده الزامی است"),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    localStorage.setItem("fullName", data.fullName);
    localStorage.setItem("username", data.username);
    localStorage.setItem("password", data.password);
    localStorage.setItem("fileNumber", data.fileNumber);
    alert("ثبت‌نام با موفقیت انجام شد!");
    navigate("/recording");
  };

  return (
    <div className=" flex items-center justify-center w-[400px] h-[480px] p-5 rounded-xl max-w-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col items-end justify-center"
      >
        {/* نام و نام خانوادگی */}
        <div className="relative flex items-end flex-col gap-3">
          <div className="flex items-center justify-center gap-1">
            <input
              type="text"
              {...register("fullName")}
              placeholder="نام و نام خانوادگی"
              className={`w-[300px] text-right text-xs p-3 border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            <Profile2User />
          </div>
          {errors.fullName && (
            <span className="text-red-500 text-xs absolute bottom-0 left-0">
              {errors.fullName.message}
            </span>
          )}
        </div>

        {/* یوزرنیم */}
        <div className="relative flex items-end flex-col gap-3">
          <div className="flex items-center justify-center gap-1">
            <input
              type="text"
              {...register("username")}
              placeholder="یوزرنیم"
              className={`w-[300px] text-right text-xs p-3 border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            <User />
          </div>
          {errors.username && (
            <span className="text-red-500 text-xs absolute bottom-0 left-0">
              {errors.username.message}
            </span>
          )}
        </div>

        {/* پسورد */}
        <div className="relative flex items-end flex-col gap-3">
          <div className="flex items-center justify-center gap-1">
            <input
              type="password"
              {...register("password")}
              placeholder="پسورد"
              className={`w-[200px] text-right text-xs p-3 border-2 rounded-lg transition-all duration-300 focus:outline-none ${
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

        {/* شماره پرونده */}
        <div className="relative flex items-end flex-col gap-3">
          <div className="flex items-center justify-center gap-1">
            <input
              type="text"
              {...register("fileNumber")}
              placeholder="شماره پرونده"
              className={`text-right text-xs p-3 border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                errors.fileNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            <NoteText />
          </div>
          {errors.fileNumber && (
            <span className="text-red-500 text-xs absolute bottom-0 left-0">
              {errors.fileNumber.message}
            </span>
          )}
        </div>

        {/* دکمه ثبت‌نام */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-400 text-black rounded-lg font-semibold transition-all duration-300"
        >
          ثبت‌نام
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
