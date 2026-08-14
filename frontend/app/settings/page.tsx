"use client";

import { useState, useRef, useEffect, useId } from "react";
import { AppShell } from "@/components/app-shell";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { Loader2, Upload, User as UserIcon, Save } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getErrorMessage } from "@/lib/utils";
import { ErrorState } from "@/components/ui/error-state";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullnameId = useId();
  const emailId = useId();

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: usersService.getMe,
  });

  const [fullname, setFullname] = useState("");

  useEffect(() => {
    if (user?.fullname) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullname(user.fullname);
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (name: string) => usersService.updateProfile({ fullname: name }),
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => usersService.uploadAvatar(file),
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
      toast.success("Avatar updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to upload avatar"));
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatarMutation.mutate(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim() || fullname === user?.fullname) return;
    updateProfileMutation.mutate(fullname);
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-foreground mb-8">Account Settings</h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-[#4A00FF] animate-spin" />
            </div>
          ) : isError ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : (
            <div className="space-y-8">
              {/* Profile Section */}
              <div className="rounded-[20px] bg-[#131316]/60 border border-white/10 p-8 backdrop-blur-[20px]">
                <h2 className="text-lg font-semibold text-foreground mb-6">Profile Details</h2>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                      {user?.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <UserIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                      {uploadAvatarMutation.isPending && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadAvatarMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-white/5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
                    >
                      <Upload className="h-4 w-4" />
                      Change Avatar
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile} className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor={fullnameId} className="text-sm font-medium text-foreground">Full Name</label>
                      <input
                        id={fullnameId}
                        type="text"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        minLength={2}
                        className="w-full h-11 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={updateProfileMutation.isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={emailId} className="text-sm font-medium text-foreground">Email</label>
                      <input
                        id={emailId}
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full h-11 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-muted-foreground opacity-50 cursor-not-allowed focus:outline-none"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={updateProfileMutation.isPending || fullname === user?.fullname || !fullname.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
                      >
                        {updateProfileMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
