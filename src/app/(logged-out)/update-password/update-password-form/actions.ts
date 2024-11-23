"use server";

type UpdatePasswordParams = {
  token: string;
  password: string;
  passwordConfirm: string;
};

export async function updatePassword({
  token,
  password,
  passwordConfirm,
}: UpdatePasswordParams) {
  return {
    error: true,
    message: "",
  };
}
