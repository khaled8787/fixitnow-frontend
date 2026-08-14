"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Bell,
  BriefcaseBusiness,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  Globe2,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  MonitorCog,
  Palette,
  Phone,
  Save,
  Settings2,
  ShieldCheck,
  User,
  UserCog,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

/* ==========================================================================
   Types
========================================================================== */

type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

type UserStatus = "ACTIVE" | "BANNED";

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: UserRole;
  status?: UserStatus;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

interface ProfileForm {
  name: string;
  phone: string;
  image: string;
}

interface NotificationSettings {
  bookingUpdates: boolean;
  emailNotifications: boolean;
  systemNotifications: boolean;
  promotionalNotifications: boolean;
}

interface AdminSettings {
  maintenanceMode: boolean;
  allowCustomerRegistration: boolean;
  allowTechnicianRegistration: boolean;
  technicianApprovalRequired: boolean;
  bookingNotifications: boolean;
  paymentNotifications: boolean;
}

interface TechnicianSettings {
  availableForBookings: boolean;
  newBookingNotifications: boolean;
  bookingStatusNotifications: boolean;
  emailNotifications: boolean;
  showPhoneToCustomers: boolean;
}

interface CustomerSettings {
  bookingNotifications: boolean;
  paymentNotifications: boolean;
  serviceRecommendations: boolean;
  emailNotifications: boolean;
  allowTechnicianContact: boolean;
}

/* ==========================================================================
   Constants
========================================================================== */

const STORAGE_KEYS = {
  notifications: "fixitnow_settings_notifications",
  admin: "fixitnow_admin_settings",
  technician: "fixitnow_technician_settings",
  customer: "fixitnow_customer_settings",
};

/* ==========================================================================
   Default Settings
========================================================================== */

const defaultNotifications: NotificationSettings = {
  bookingUpdates: true,
  emailNotifications: true,
  systemNotifications: true,
  promotionalNotifications: false,
};

const defaultAdminSettings: AdminSettings = {
  maintenanceMode: false,
  allowCustomerRegistration: true,
  allowTechnicianRegistration: true,
  technicianApprovalRequired: true,
  bookingNotifications: true,
  paymentNotifications: true,
};

const defaultTechnicianSettings: TechnicianSettings = {
  availableForBookings: true,
  newBookingNotifications: true,
  bookingStatusNotifications: true,
  emailNotifications: true,
  showPhoneToCustomers: true,
};

const defaultCustomerSettings: CustomerSettings = {
  bookingNotifications: true,
  paymentNotifications: true,
  serviceRecommendations: true,
  emailNotifications: true,
  allowTechnicianContact: true,
};

/* ==========================================================================
   Page
========================================================================== */

export default function SettingsPage() {
  const router = useRouter();

  const {
    user,
    isLoading: authLoading,
    isAuthenticated,
    logout,
  } = useAuth();

  const [activeSection, setActiveSection] =
    useState("profile");

  const [isSavingProfile, setIsSavingProfile] =
    useState(false);

  const [isSavingSettings, setIsSavingSettings] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [profile, setProfile] =
    useState<ProfileForm>({
      name: "",
      phone: "",
      image: "",
    });

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [notifications, setNotifications] =
    useState<NotificationSettings>(
      defaultNotifications,
    );

  const [adminSettings, setAdminSettings] =
    useState<AdminSettings>(
      defaultAdminSettings,
    );

  const [technicianSettings, setTechnicianSettings] =
    useState<TechnicianSettings>(
      defaultTechnicianSettings,
    );

  const [customerSettings, setCustomerSettings] =
    useState<CustomerSettings>(
      defaultCustomerSettings,
    );

  /* ------------------------------------------------------------------------
     Authentication
  ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [
    authLoading,
    isAuthenticated,
    router,
  ]);

  /* ------------------------------------------------------------------------
     Populate user profile
  ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfile({
      name: user.name || "",
      phone: user.phone || "",
      image: user.image || "",
    });
  }, [user]);

  /* ------------------------------------------------------------------------
     Load local settings
  ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!user) {
      return;
    }

    try {
      const savedNotifications =
        localStorage.getItem(
          STORAGE_KEYS.notifications,
        );

      const savedAdmin =
        localStorage.getItem(
          STORAGE_KEYS.admin,
        );

      const savedTechnician =
        localStorage.getItem(
          STORAGE_KEYS.technician,
        );

      const savedCustomer =
        localStorage.getItem(
          STORAGE_KEYS.customer,
        );

      if (savedNotifications) {
        setNotifications({
          ...defaultNotifications,
          ...JSON.parse(savedNotifications),
        });
      }

      if (savedAdmin) {
        setAdminSettings({
          ...defaultAdminSettings,
          ...JSON.parse(savedAdmin),
        });
      }

      if (savedTechnician) {
        setTechnicianSettings({
          ...defaultTechnicianSettings,
          ...JSON.parse(savedTechnician),
        });
      }

      if (savedCustomer) {
        setCustomerSettings({
          ...defaultCustomerSettings,
          ...JSON.parse(savedCustomer),
        });
      }
    } catch (error) {
      console.error(
        "LOAD SETTINGS ERROR:",
        error,
      );
    }
  }, [user]);

  /* ------------------------------------------------------------------------
     Role
  ------------------------------------------------------------------------ */

  const role = user?.role;

  /* ------------------------------------------------------------------------
     Navigation items
  ------------------------------------------------------------------------ */

  const settingsNavigation = useMemo(() => {
    const base = [
      {
        id: "profile",
        label: "Profile",
        description: "Personal information",
        icon: User,
      },
      {
        id: "security",
        label: "Security",
        description: "Password and account",
        icon: ShieldCheck,
      },
      {
        id: "notifications",
        label: "Notifications",
        description: "Notification preferences",
        icon: Bell,
      },
    ];

    if (role === "ADMIN") {
      return [
        ...base,
        {
          id: "platform",
          label: "Platform",
          description: "Platform configuration",
          icon: Globe2,
        },
        {
          id: "users",
          label: "User Management",
          description: "Registration controls",
          icon: Users,
        },
        {
          id: "booking",
          label: "Booking",
          description: "Booking preferences",
          icon: CalendarCheck2,
        },
      ];
    }

    if (role === "TECHNICIAN") {
      return [
        ...base,
        {
          id: "professional",
          label: "Professional",
          description: "Technician preferences",
          icon: BriefcaseBusiness,
        },
        {
          id: "availability",
          label: "Availability",
          description: "Booking availability",
          icon: Clock3,
        },
      ];
    }

    return [
      ...base,
      {
        id: "booking",
        label: "Booking",
        description: "Booking preferences",
        icon: CalendarCheck2,
      },
      {
        id: "contact",
        label: "Contact",
        description: "Contact preferences",
        icon: Phone,
      },
    ];
  }, [role]);

  /* ------------------------------------------------------------------------
     Profile Update
  ------------------------------------------------------------------------ */

  const handleProfileSave = useCallback(
    async () => {
      if (!user) {
        return;
      }

      if (!profile.name.trim()) {
        toast.error("Name is required.");
        return;
      }

      if (profile.name.trim().length < 2) {
        toast.error(
          "Name must be at least 2 characters.",
        );
        return;
      }

      if (
        profile.image.trim() &&
        !isValidUrl(profile.image.trim())
      ) {
        toast.error(
          "Please enter a valid image URL.",
        );
        return;
      }

      try {
        setIsSavingProfile(true);

        const response = await api.patch<
          ApiResponse<DashboardUser>
        >(
          `/api/api/users/${user.id}`,
          {
            name: profile.name.trim(),
            phone:
              profile.phone.trim() || undefined,
            image:
              profile.image.trim() || undefined,
          },
        );

        if (
          response.data?.success === false
        ) {
          throw new Error(
            response.data?.message ||
              "Failed to update profile.",
          );
        }

        toast.success(
          response.data?.message ||
            "Profile updated successfully.",
        );

        /*
         * AuthContext implementation may vary.
         * Reloading ensures the updated user information
         * is reflected everywhere after the backend update.
         */
        window.location.reload();
      } catch (error: any) {
        console.error(
          "UPDATE PROFILE ERROR:",
          error,
        );

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to update profile.",
        );
      } finally {
        setIsSavingProfile(false);
      }
    },
    [profile, user],
  );

  /* ------------------------------------------------------------------------
     Password
  ------------------------------------------------------------------------ */

  const handlePasswordChange = () => {
    if (!currentPassword) {
      toast.error(
        "Current password is required.",
      );
      return;
    }

    if (!newPassword) {
      toast.error(
        "New password is required.",
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "Passwords do not match.",
      );
      return;
    }

    /*
     * IMPORTANT:
     * The backend code supplied earlier does not contain
     * a change-password route.
     *
     * Therefore we intentionally do not send a fake API
     * request here.
     */
    toast.error(
      "Password change API is not available in the current backend.",
    );
  };

  /* ------------------------------------------------------------------------
     Notifications
  ------------------------------------------------------------------------ */

  const saveNotifications = () => {
    try {
      setIsSavingSettings(true);

      localStorage.setItem(
        STORAGE_KEYS.notifications,
        JSON.stringify(notifications),
      );

      toast.success(
        "Notification settings saved.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to save notification settings.",
      );
    } finally {
      setIsSavingSettings(false);
    }
  };

  /* ------------------------------------------------------------------------
     Admin settings
  ------------------------------------------------------------------------ */

  const saveAdminSettings = () => {
    try {
      setIsSavingSettings(true);

      localStorage.setItem(
        STORAGE_KEYS.admin,
        JSON.stringify(adminSettings),
      );

      toast.success(
        "Admin settings saved.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to save admin settings.",
      );
    } finally {
      setIsSavingSettings(false);
    }
  };

  /* ------------------------------------------------------------------------
     Technician settings
  ------------------------------------------------------------------------ */

  const saveTechnicianSettings = () => {
    try {
      setIsSavingSettings(true);

      localStorage.setItem(
        STORAGE_KEYS.technician,
        JSON.stringify(
          technicianSettings,
        ),
      );

      toast.success(
        "Technician settings saved.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to save technician settings.",
      );
    } finally {
      setIsSavingSettings(false);
    }
  };

  /* ------------------------------------------------------------------------
     Customer settings
  ------------------------------------------------------------------------ */

  const saveCustomerSettings = () => {
    try {
      setIsSavingSettings(true);

      localStorage.setItem(
        STORAGE_KEYS.customer,
        JSON.stringify(
          customerSettings,
        ),
      );

      toast.success(
        "Customer settings saved.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to save customer settings.",
      );
    } finally {
      setIsSavingSettings(false);
    }
  };

  /* ------------------------------------------------------------------------
     Logout
  ------------------------------------------------------------------------ */

  const handleLogout = () => {
    try {
      logout();
      router.replace("/login");
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error,
      );

      router.replace("/login");
    }
  };

  /* ------------------------------------------------------------------------
     Loading
  ------------------------------------------------------------------------ */

  if (authLoading) {
    return <SettingsLoading />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ================================================================
          Header
      ================================================================= */}

      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <LayoutDashboard className="size-3.5" />
                Dashboard
                <ChevronRight className="size-3" />
                Settings
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Manage your FixItNow account and
                preferences from one place.
              </p>
            </div>

            <RoleBadge role={user.role} />
          </div>
        </div>
      </section>

      {/* ================================================================
          Main
      ================================================================= */}

      <section className="py-8 sm:py-10">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
          {/* ============================================================
              Sidebar
          ============================================================= */}

          <aside className="h-fit rounded-3xl border border-border/60 bg-background p-3 shadow-sm lg:sticky lg:top-6">
            <div className="mb-3 px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account Settings
              </p>
            </div>

            <nav className="space-y-1">
              {settingsNavigation.map(
                (item) => {
                  const Icon = item.icon;

                  const active =
                    activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setActiveSection(
                          item.id,
                        )
                      }
                      className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                          active
                            ? "bg-primary/10"
                            : "bg-muted/60"
                        }`}
                      >
                        <Icon className="size-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          {item.label}
                        </span>

                        <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                          {item.description}
                        </span>
                      </span>

                      {active && (
                        <ChevronRight className="size-4 shrink-0" />
                      )}
                    </button>
                  );
                },
              )}
            </nav>

            <div className="my-4 h-px bg-border/60" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </aside>

          {/* ============================================================
              Content
          ============================================================= */}

          <div className="min-w-0">
            {/* Profile */}

            {activeSection === "profile" && (
              <ProfileSettings
                user={user}
                profile={profile}
                setProfile={setProfile}
                isSaving={isSavingProfile}
                onSave={handleProfileSave}
              />
            )}

            {/* Security */}

            {activeSection === "security" && (
              <SecuritySettings
                currentPassword={
                  currentPassword
                }
                newPassword={newPassword}
                confirmPassword={
                  confirmPassword
                }
                showPassword={showPassword}
                showNewPassword={
                  showNewPassword
                }
                setCurrentPassword={
                  setCurrentPassword
                }
                setNewPassword={
                  setNewPassword
                }
                setConfirmPassword={
                  setConfirmPassword
                }
                setShowPassword={
                  setShowPassword
                }
                setShowNewPassword={
                  setShowNewPassword
                }
                onChangePassword={
                  handlePasswordChange
                }
              />
            )}

            {/* Notifications */}

            {activeSection ===
              "notifications" && (
              <NotificationSettingsPanel
                settings={notifications}
                setSettings={
                  setNotifications
                }
                isSaving={
                  isSavingSettings
                }
                onSave={
                  saveNotifications
                }
              />
            )}

            {/* ==========================================================
                ADMIN ONLY
            =========================================================== */}

            {role === "ADMIN" &&
              activeSection ===
                "platform" && (
                <AdminPlatformSettings
                  settings={adminSettings}
                  setSettings={
                    setAdminSettings
                  }
                  isSaving={
                    isSavingSettings
                  }
                  onSave={
                    saveAdminSettings
                  }
                />
              )}

            {role === "ADMIN" &&
              activeSection === "users" && (
                <AdminUserSettings
                  settings={adminSettings}
                  setSettings={
                    setAdminSettings
                  }
                  isSaving={
                    isSavingSettings
                  }
                  onSave={
                    saveAdminSettings
                  }
                />
              )}

            {role === "ADMIN" &&
              activeSection ===
                "booking" && (
                <AdminBookingSettings
                  settings={adminSettings}
                  setSettings={
                    setAdminSettings
                  }
                  isSaving={
                    isSavingSettings
                  }
                  onSave={
                    saveAdminSettings
                  }
                />
              )}

            {/* ==========================================================
                TECHNICIAN ONLY
            =========================================================== */}

            {role === "TECHNICIAN" &&
              activeSection ===
                "professional" && (
                <TechnicianProfessionalSettings
                  settings={
                    technicianSettings
                  }
                  setSettings={
                    setTechnicianSettings
                  }
                  isSaving={
                    isSavingSettings
                  }
                  onSave={
                    saveTechnicianSettings
                  }
                />
              )}

            {role === "TECHNICIAN" &&
              activeSection ===
                "availability" && (
                <TechnicianAvailabilitySettings
                  settings={
                    technicianSettings
                  }
                  setSettings={
                    setTechnicianSettings
                  }
                  isSaving={
                    isSavingSettings
                  }
                  onSave={
                    saveTechnicianSettings
                  }
                />
              )}

            {/* ==========================================================
                CUSTOMER ONLY
            =========================================================== */}

            {role === "CUSTOMER" &&
              activeSection ===
                "booking" && (
                <CustomerBookingSettings
                  settings={
                    customerSettings
                  }
                  setSettings={
                    setCustomerSettings
                  }
                  isSaving={
                    isSavingSettings
                  }
                  onSave={
                    saveCustomerSettings
                  }
                />
              )}

            {role === "CUSTOMER" &&
              activeSection === "contact" && (
                <CustomerContactSettings
                  settings={
                    customerSettings
                  }
                  setSettings={
                    setCustomerSettings
                  }
                  isSaving={
                    isSavingSettings
                  }
                  onSave={
                    saveCustomerSettings
                  }
                />
              )}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ==========================================================================
   Loading
========================================================================== */

function SettingsLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Settings2 className="size-6 animate-pulse" />
        </div>

        <p className="mt-4 text-sm font-semibold">
          Loading settings...
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Checking your account
        </p>
      </div>
    </main>
  );
}

/* ==========================================================================
   Role Badge
========================================================================== */

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  const config = {
    ADMIN: {
      label: "Administrator",
      icon: ShieldCheck,
    },
    TECHNICIAN: {
      label: "Technician",
      icon: Wrench,
    },
    CUSTOMER: {
      label: "Customer",
      icon: User,
    },
  };

  const current = config[role];
  const Icon = current.icon;

  return (
    <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary sm:self-auto">
      <Icon className="size-4" />
      {current.label}
    </div>
  );
}

/* ==========================================================================
   Profile Settings
========================================================================== */

function ProfileSettings({
  user,
  profile,
  setProfile,
  isSaving,
  onSave,
}: {
  user: DashboardUser;
  profile: ProfileForm;
  setProfile: React.Dispatch<
    React.SetStateAction<ProfileForm>
  >;
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      icon={UserCog}
      title="Profile Information"
      description="Update your personal FixItNow account information."
    >
      <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
        {/* Avatar */}

        <div className="flex flex-col items-center lg:items-start">
          <div className="flex size-28 items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-primary/10 text-3xl font-bold text-primary">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="size-full object-cover"
              />
            ) : (
              profile.name
                ?.charAt(0)
                .toUpperCase() || "U"
            )}
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground lg:text-left">
            Profile image URL
          </p>
        </div>

        {/* Form */}

        <div className="space-y-5">
          <Field
            label="Full Name"
            icon={User}
            value={profile.name}
            onChange={(value) =>
              setProfile((previous) => ({
                ...previous,
                name: value,
              }))
            }
            placeholder="Your full name"
          />

          <Field
            label="Email"
            icon={Mail}
            value={user.email}
            disabled
            placeholder="Email address"
            description="Email is managed by your account and cannot be changed here."
          />

          <Field
            label="Phone"
            icon={Phone}
            value={profile.phone}
            onChange={(value) =>
              setProfile((previous) => ({
                ...previous,
                phone: value,
              }))
            }
            placeholder="+8801XXXXXXXXX"
          />

          <Field
            label="Profile Image URL"
            icon={Eye}
            value={profile.image}
            onChange={(value) =>
              setProfile((previous) => ({
                ...previous,
                image: value,
              }))
            }
            placeholder="https://example.com/image.jpg"
          />

          <div className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}

              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

/* ==========================================================================
   Security
========================================================================== */

function SecuritySettings({
  currentPassword,
  newPassword,
  confirmPassword,
  showPassword,
  showNewPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  setShowPassword,
  setShowNewPassword,
  onChangePassword,
}: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showPassword: boolean;
  showNewPassword: boolean;
  setCurrentPassword: (
    value: string,
  ) => void;
  setNewPassword: (
    value: string,
  ) => void;
  setConfirmPassword: (
    value: string,
  ) => void;
  setShowPassword: (
    value: boolean,
  ) => void;
  setShowNewPassword: (
    value: boolean,
  ) => void;
  onChangePassword: () => void;
}) {
  return (
    <SettingsCard
      icon={KeyRound}
      title="Security"
      description="Protect your FixItNow account."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-600" />

            <div>
              <p className="text-sm font-semibold">
                Password API required
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                The current backend you provided does
                not expose a change-password endpoint.
                The form is ready, but no fake request
                will be sent.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            show={showPassword}
            onChange={
              setCurrentPassword
            }
            onToggle={() =>
              setShowPassword(
                !showPassword,
              )
            }
          />

          <PasswordField
            label="New Password"
            value={newPassword}
            show={showNewPassword}
            onChange={setNewPassword}
            onToggle={() =>
              setShowNewPassword(
                !showNewPassword,
              )
            }
          />

          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            show={showNewPassword}
            onChange={
              setConfirmPassword
            }
            onToggle={() =>
              setShowNewPassword(
                !showNewPassword,
              )
            }
          />
        </div>

        <div className="flex justify-end border-t border-border/60 pt-5">
          <button
            type="button"
            onClick={onChangePassword}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <KeyRound className="size-4" />
            Change Password
          </button>
        </div>
      </div>
    </SettingsCard>
  );
}

/* ==========================================================================
   Notifications
========================================================================== */

function NotificationSettingsPanel({
  settings,
  setSettings,
  isSaving,
  onSave,
}: {
  settings: NotificationSettings;
  setSettings: React.Dispatch<
    React.SetStateAction<NotificationSettings>
  >;
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      icon={Bell}
      title="Notifications"
      description="Choose which notifications you want to receive."
    >
      <div className="space-y-3">
        <ToggleRow
          icon={CalendarCheck2}
          title="Booking Updates"
          description="Receive updates when booking status changes."
          checked={settings.bookingUpdates}
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              bookingUpdates:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={Mail}
          title="Email Notifications"
          description="Receive important account notifications by email."
          checked={settings.emailNotifications}
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              emailNotifications:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={ShieldCheck}
          title="System Notifications"
          description="Receive important FixItNow system alerts."
          checked={settings.systemNotifications}
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              systemNotifications:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={Palette}
          title="Promotional Notifications"
          description="Receive promotions, offers and platform updates."
          checked={
            settings.promotionalNotifications
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              promotionalNotifications:
                checked,
            }))
          }
        />
      </div>

      <SaveButton
        isSaving={isSaving}
        onClick={onSave}
      />
    </SettingsCard>
  );
}

/* ==========================================================================
   ADMIN - Platform
========================================================================== */

function AdminPlatformSettings({
  settings,
  setSettings,
  isSaving,
  onSave,
}: {
  settings: AdminSettings;
  setSettings: React.Dispatch<
    React.SetStateAction<AdminSettings>
  >;
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      icon={Globe2}
      title="Platform Settings"
      description="Configure the FixItNow platform behavior."
    >
      <div className="space-y-3">
        <ToggleRow
          icon={MonitorCog}
          title="Maintenance Mode"
          description="Show the platform as temporarily unavailable."
          checked={settings.maintenanceMode}
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              maintenanceMode:
                checked,
            }))
          }
          danger
        />

        <ToggleRow
          icon={Users}
          title="Customer Registration"
          description="Allow new customers to create accounts."
          checked={
            settings.allowCustomerRegistration
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              allowCustomerRegistration:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={Wrench}
          title="Technician Registration"
          description="Allow technicians to register on the platform."
          checked={
            settings.allowTechnicianRegistration
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              allowTechnicianRegistration:
                checked,
            }))
          }
        />
      </div>

      <SaveButton
        isSaving={isSaving}
        onClick={onSave}
      />
    </SettingsCard>
  );
}

/* ==========================================================================
   ADMIN - Users
========================================================================== */

function AdminUserSettings({
  settings,
  setSettings,
  isSaving,
  onSave,
}: {
  settings: AdminSettings;
  setSettings: React.Dispatch<
    React.SetStateAction<AdminSettings>
  >;
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      icon={Users}
      title="User Management"
      description="Control how customers and technicians join the platform."
    >
      <div className="space-y-3">
        <ToggleRow
          icon={Users}
          title="Customer Registration"
          description="Allow customers to register new accounts."
          checked={
            settings.allowCustomerRegistration
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              allowCustomerRegistration:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={Wrench}
          title="Technician Registration"
          description="Allow technicians to register new accounts."
          checked={
            settings.allowTechnicianRegistration
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              allowTechnicianRegistration:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={ShieldCheck}
          title="Technician Approval Required"
          description="Require admin approval before technicians become active."
          checked={
            settings.technicianApprovalRequired
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              technicianApprovalRequired:
                checked,
            }))
          }
        />
      </div>

      <SaveButton
        isSaving={isSaving}
        onClick={onSave}
      />
    </SettingsCard>
  );
}

/* ==========================================================================
   ADMIN - Booking
========================================================================== */

function AdminBookingSettings({
  settings,
  setSettings,
  isSaving,
  onSave,
}: {
  settings: AdminSettings;
  setSettings: React.Dispatch<
    React.SetStateAction<AdminSettings>
  >;
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      icon={CalendarCheck2}
      title="Booking Settings"
      description="Configure booking-related notifications and platform behavior."
    >
      <div className="space-y-3">
        <ToggleRow
          icon={Bell}
          title="Booking Notifications"
          description="Notify admins when new bookings are created or updated."
          checked={
            settings.bookingNotifications
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              bookingNotifications:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={CheckCircle2}
          title="Payment Notifications"
          description="Notify admins when booking payments change."
          checked={
            settings.paymentNotifications
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              paymentNotifications:
                checked,
            }))
          }
        />
      </div>

      <SaveButton
        isSaving={isSaving}
        onClick={onSave}
      />
    </SettingsCard>
  );
}

/* ==========================================================================
   TECHNICIAN - Professional
========================================================================== */

function TechnicianProfessionalSettings({
  settings,
  setSettings,
  isSaving,
  onSave,
}: {
  settings: TechnicianSettings;
  setSettings: React.Dispatch<
    React.SetStateAction<TechnicianSettings>
  >;
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      icon={BriefcaseBusiness}
      title="Professional Settings"
      description="Manage how customers interact with your technician account."
    >
      <div className="space-y-3">
        <ToggleRow
          icon={CalendarCheck2}
          title="Available for Bookings"
          description="Allow customers to request your services."
          checked={
            settings.availableForBookings
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              availableForBookings:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={Bell}
          title="New Booking Notifications"
          description="Receive alerts when customers create bookings."
          checked={
            settings.newBookingNotifications
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              newBookingNotifications:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={CheckCircle2}
          title="Booking Status Notifications"
          description="Receive status updates about your bookings."
          checked={
            settings.bookingStatusNotifications
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              bookingStatusNotifications:
                checked,
            }))
          }
        />
      </div>

      <SaveButton
        isSaving={isSaving}
        onClick={onSave}
      />
    </SettingsCard>
  );
}

/* ==========================================================================
   TECHNICIAN - Availability
========================================================================== */

function TechnicianAvailabilitySettings({
  settings,
  setSettings,
  isSaving,
  onSave,
}: {
  settings: TechnicianSettings;
  setSettings: React.Dispatch<
    React.SetStateAction<TechnicianSettings>
  >;
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      icon={Clock3}
      title="Availability"
      description="Control your availability and customer contact preferences."
    >
      <div className="space-y-3">
        <ToggleRow
          icon={CalendarCheck2}
          title="Accept New Bookings"
          description="Customers can request your services when enabled."
          checked={
            settings.availableForBookings
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              availableForBookings:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={Phone}
          title="Show Phone to Customers"
          description="Allow customers to see your phone number."
          checked={
            settings.showPhoneToCustomers
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              showPhoneToCustomers:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={Mail}
          title="Email Notifications"
          description="Receive technician account updates by email."
          checked={
            settings.emailNotifications
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              emailNotifications:
                checked,
            }))
          }
        />
      </div>

      <SaveButton
        isSaving={isSaving}
        onClick={onSave}
      />
    </SettingsCard>
  );
}

/* ==========================================================================
   CUSTOMER - Booking
========================================================================== */

function CustomerBookingSettings({
  settings,
  setSettings,
  isSaving,
  onSave,
}: {
  settings: CustomerSettings;
  setSettings: React.Dispatch<
    React.SetStateAction<CustomerSettings>
  >;
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      icon={CalendarCheck2}
      title="Booking Preferences"
      description="Control how FixItNow keeps you informed about your bookings."
    >
      <div className="space-y-3">
        <ToggleRow
          icon={Bell}
          title="Booking Notifications"
          description="Receive notifications about booking status changes."
          checked={
            settings.bookingNotifications
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              bookingNotifications:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={CheckCircle2}
          title="Payment Notifications"
          description="Receive payment and transaction updates."
          checked={
            settings.paymentNotifications
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              paymentNotifications:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={Wrench}
          title="Service Recommendations"
          description="Receive recommendations for useful services."
          checked={
            settings.serviceRecommendations
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              serviceRecommendations:
                checked,
            }))
          }
        />
      </div>

      <SaveButton
        isSaving={isSaving}
        onClick={onSave}
      />
    </SettingsCard>
  );
}

/* ==========================================================================
   CUSTOMER - Contact
========================================================================== */

function CustomerContactSettings({
  settings,
  setSettings,
  isSaving,
  onSave,
}: {
  settings: CustomerSettings;
  setSettings: React.Dispatch<
    React.SetStateAction<CustomerSettings>
  >;
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      icon={Phone}
      title="Contact Preferences"
      description="Manage how technicians and FixItNow can contact you."
    >
      <div className="space-y-3">
        <ToggleRow
          icon={Phone}
          title="Allow Technician Contact"
          description="Allow assigned technicians to contact you regarding bookings."
          checked={
            settings.allowTechnicianContact
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              allowTechnicianContact:
                checked,
            }))
          }
        />

        <ToggleRow
          icon={Mail}
          title="Email Notifications"
          description="Receive important account updates by email."
          checked={
            settings.emailNotifications
          }
          onChange={(checked) =>
            setSettings((previous) => ({
              ...previous,
              emailNotifications:
                checked,
            }))
          }
        />
      </div>

      <SaveButton
        isSaving={isSaving}
        onClick={onSave}
      />
    </SettingsCard>
  );
}

/* ==========================================================================
   Generic Settings Card
========================================================================== */

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm">
      <div className="border-b border-border/60 bg-muted/20 p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {children}
      </div>
    </section>
  );
}

/* ==========================================================================
   Field
========================================================================== */

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  disabled = false,
  description,
}: {
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  description?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <div
        className={`flex min-h-12 items-center gap-3 rounded-xl border border-border/60 bg-background px-3 transition-colors ${
          disabled
            ? "bg-muted/40 opacity-70"
            : "focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10"
        }`}
      >
        <Icon className="size-4 shrink-0 text-muted-foreground" />

        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange?.(event.target.value)
          }
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>

      {description && (
        <p className="mt-2 text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/* ==========================================================================
   Password Field
========================================================================== */

function PasswordField({
  label,
  value,
  show,
  onChange,
  onToggle,
}: {
  label: string;
  value: string;
  show: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <div className="flex min-h-12 items-center gap-3 rounded-xl border border-border/60 bg-background px-3 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
        <KeyRound className="size-4 shrink-0 text-muted-foreground" />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          placeholder="••••••••"
        />

        <button
          type="button"
          onClick={onToggle}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={
            show
              ? "Hide password"
              : "Show password"
          }
        >
          {show ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   Toggle Row
========================================================================== */

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  danger = false,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
          danger
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() =>
          onChange(!checked)
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked
            ? danger
              ? "bg-destructive"
              : "bg-primary"
            : "bg-muted-foreground/25"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${
            checked
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ==========================================================================
   Save Button
========================================================================== */

function SaveButton({
  isSaving,
  onClick,
}: {
  isSaving: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mt-6 flex justify-end border-t border-border/60 pt-5">
      <button
        type="button"
        onClick={onClick}
        disabled={isSaving}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}

        {isSaving
          ? "Saving..."
          : "Save Settings"}
      </button>
    </div>
  );
}

/* ==========================================================================
   Helpers
========================================================================== */

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}