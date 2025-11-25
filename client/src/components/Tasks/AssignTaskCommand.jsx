import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserPlus,
  X,
  Check,
  Users,
  Crown,
  Pencil,
  Eye,
  Search,
  UserCircle,
} from "lucide-react";
import { useListMembers } from "@/hooks/useListMembers";

export function AssignTaskCommand({
  listId,
  assignedUsers = [],
  onAssigneeChange,
  currentUserId,
  disabled = false,
  trigger,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { members, loading } = useListMembers(listId);

  // Filtrar miembros por búsqueda
  const filteredMembers = useMemo(() => {
    if (!searchValue.trim()) return members;

    const search = searchValue.toLowerCase();
    return members.filter((member) => {
      const name = getDisplayName(member.profiles).toLowerCase();
      const email = (member.profiles?.email || "").toLowerCase();
      return name.includes(search) || email.includes(search);
    });
  }, [members, searchValue]);

  // Verificar si un usuario está asignado
  const isAssigned = useCallback(
    (userId) => {
      return assignedUsers.some((u) => u.id === userId || u === userId);
    },
    [assignedUsers]
  );

  // Toggle asignación de usuario
  const toggleAssignee = (member) => {
    const userId = member.profiles?.id;
    if (!userId) return;

    let newAssignees;
    if (isAssigned(userId)) {
      newAssignees = assignedUsers.filter((u) => (u.id || u) !== userId);
    } else {
      newAssignees = [
        ...assignedUsers,
        {
          id: userId,
          first_name: member.profiles?.first_name,
          last_name: member.profiles?.last_name,
          email: member.profiles?.email,
          avatar_url: member.profiles?.avatar_url,
        },
      ];
    }
    onAssigneeChange(newAssignees);
  };

  // Quitar asignado
  const removeAssignee = (userId, e) => {
    e?.stopPropagation();
    const newAssignees = assignedUsers.filter((u) => (u.id || u) !== userId);
    onAssigneeChange(newAssignees);
  };

  function getInitials(profile) {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.email) {
      return profile.email[0].toUpperCase();
    }
    return "?";
  }

  function getDisplayName(profile) {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.email || t("assign.unknownUser");
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "owner":
        return <Crown className="assign-role-icon owner" />;
      case "editor":
        return <Pencil className="assign-role-icon editor" />;
      default:
        return <Eye className="assign-role-icon viewer" />;
    }
  };

  // Obtener datos de usuario asignado
  const getAssignedUserData = (assignee) => {
    if (typeof assignee === "object") return assignee;
    const member = members.find((m) => m.profiles?.id === assignee);
    return member?.profiles || { id: assignee };
  };

  // Trigger por defecto
  const defaultTrigger = (
    <Button variant="outline" className="assign-trigger" disabled={disabled}>
      {assignedUsers.length > 0 ? (
        <div className="assign-trigger-content">
          <div className="assign-avatars-stack">
            {assignedUsers.slice(0, 3).map((assignee, index) => {
              const userData = getAssignedUserData(assignee);
              return (
                <Avatar
                  key={userData.id || index}
                  className="assign-avatar-stacked"
                  style={{ zIndex: 3 - index }}
                >
                  {userData.avatar_url && (
                    <AvatarImage src={userData.avatar_url} />
                  )}
                  <AvatarFallback className="assign-avatar-fallback">
                    {getInitials(userData)}
                  </AvatarFallback>
                </Avatar>
              );
            })}
            {assignedUsers.length > 3 && (
              <span className="assign-more-count">
                +{assignedUsers.length - 3}
              </span>
            )}
          </div>
          <span className="assign-trigger-text">
            {assignedUsers.length === 1
              ? getDisplayName(getAssignedUserData(assignedUsers[0]))
              : t("assign.multipleAssigned", { count: assignedUsers.length })}
          </span>
        </div>
      ) : (
        <div className="assign-trigger-empty">
          <UserPlus className="assign-trigger-icon" />
          <span>{t("assign.assignTask")}</span>
        </div>
      )}
    </Button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
      <PopoverContent className="assign-popover" align="start">
        <Command className="assign-command" shouldFilter={false}>
          <div className="assign-header">
            <Users className="assign-header-icon" />
            <span>{t("assign.title")}</span>
          </div>

          {/* Assigned Users Chips */}
          {assignedUsers.length > 0 && (
            <div className="assign-chips-container">
              {assignedUsers.map((assignee) => {
                const userData = getAssignedUserData(assignee);
                return (
                  <div key={userData.id} className="assign-chip">
                    <Avatar className="assign-chip-avatar">
                      {userData.avatar_url && (
                        <AvatarImage src={userData.avatar_url} />
                      )}
                      <AvatarFallback>{getInitials(userData)}</AvatarFallback>
                    </Avatar>
                    <span className="assign-chip-name">
                      {getDisplayName(userData)}
                    </span>
                    <button
                      className="assign-chip-remove"
                      onClick={(e) => removeAssignee(userData.id, e)}
                    >
                      <X className="assign-chip-remove-icon" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <CommandInput
            placeholder={t("assign.searchPlaceholder")}
            value={searchValue}
            onValueChange={setSearchValue}
          />

          <CommandList>
            <CommandEmpty>
              <div className="assign-empty">
                <Search className="assign-empty-icon" />
                <span>{t("assign.noResults")}</span>
              </div>
            </CommandEmpty>

            {!loading && filteredMembers.length > 0 && (
              <CommandGroup heading={t("assign.listMembers")}>
                <ScrollArea className="assign-members-scroll">
                  {filteredMembers.map((member) => {
                    const userId = member.profiles?.id;
                    const assigned = isAssigned(userId);
                    const isCurrentUser = userId === currentUserId;

                    return (
                      <CommandItem
                        key={userId}
                        value={userId}
                        onSelect={() => toggleAssignee(member)}
                        className={`assign-member-item ${
                          assigned ? "selected" : ""
                        }`}
                      >
                        <div className="assign-member-info">
                          <Avatar className="assign-member-avatar">
                            {member.profiles?.avatar_url && (
                              <AvatarImage src={member.profiles.avatar_url} />
                            )}
                            <AvatarFallback>
                              {getInitials(member.profiles)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="assign-member-details">
                            <span className="assign-member-name">
                              {getDisplayName(member.profiles)}
                              {isCurrentUser && (
                                <span className="assign-you">
                                  ({t("assign.you")})
                                </span>
                              )}
                            </span>
                            <span className="assign-member-email">
                              {member.profiles?.email}
                            </span>
                          </div>
                        </div>
                        <div className="assign-member-actions">
                          {getRoleIcon(member.role)}
                          {assigned && (
                            <div className="assign-check">
                              <Check className="assign-check-icon" />
                            </div>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </ScrollArea>
              </CommandGroup>
            )}

            {loading && (
              <div className="assign-loading">
                <div className="assign-loading-spinner" />
                <span>{t("assign.loading")}</span>
              </div>
            )}
          </CommandList>

          {/* Quick assign to self */}
          {currentUserId && !isAssigned(currentUserId) && (
            <>
              <CommandSeparator />
              <div className="assign-quick-actions">
                <Button
                  variant="ghost"
                  className="assign-quick-btn"
                  onClick={() => {
                    const currentMember = members.find(
                      (m) => m.profiles?.id === currentUserId
                    );
                    if (currentMember) toggleAssignee(currentMember);
                  }}
                >
                  <UserCircle className="assign-quick-icon" />
                  {t("assign.assignToMe")}
                </Button>
              </div>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Componente simplificado para mostrar avatares de asignados
export function AssignedAvatars({
  assignedUsers = [],
  maxDisplay = 3,
  size = "sm",
}) {
  const { t } = useTranslation();

  if (assignedUsers.length === 0) {
    return (
      <div className="assigned-empty">
        <UserCircle className="assigned-empty-icon" />
      </div>
    );
  }

  const getInitials = (user) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "?";
  };

  return (
    <div className={`assigned-avatars size-${size}`}>
      {assignedUsers.slice(0, maxDisplay).map((user, index) => (
        <Avatar
          key={user.id || index}
          className="assigned-avatar"
          style={{ zIndex: maxDisplay - index }}
        >
          {user.avatar_url && <AvatarImage src={user.avatar_url} />}
          <AvatarFallback>{getInitials(user)}</AvatarFallback>
        </Avatar>
      ))}
      {assignedUsers.length > maxDisplay && (
        <span className="assigned-more">
          +{assignedUsers.length - maxDisplay}
        </span>
      )}
    </div>
  );
}
