import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Crown,
  Pencil,
  Eye,
  UserPlus,
  X,
  Mail,
  Users,
  Shield,
  Loader2,
} from "lucide-react";
import { useListMembers } from "@/hooks/useListMembers";

// Roles disponibles para miembros
const MEMBER_ROLES = {
  owner: { id: "owner", icon: Crown, color: "#f59e0b" },
  editor: { id: "editor", icon: Pencil, color: "#10b981" },
  viewer: { id: "viewer", icon: Eye, color: "#64748b" },
};

export function ShareListDialog({ open, onOpenChange, list, currentUserId }) {
  const { t } = useTranslation();
  const [emailInput, setEmailInput] = useState("");
  const [selectedRole, setSelectedRole] = useState("editor");
  const [isInviting, setIsInviting] = useState(false);
  const [loadingMemberId, setLoadingMemberId] = useState(null);

  const { members, loading, addMember, updateMemberRole, removeMember } =
    useListMembers(list?.id);

  // Separar owner de otros miembros
  const { owner, collaborators } = useMemo(() => {
    const owner = members.find((m) => m.role === "owner");
    const collaborators = members.filter((m) => m.role !== "owner");
    return { owner, collaborators };
  }, [members]);

  const isOwner = owner?.profiles?.id === currentUserId;

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsInviting(true);
    try {
      const result = await addMember(emailInput.trim(), selectedRole);
      if (result.success) {
        toast.success(t("share.memberAdded"));
        setEmailInput("");
      } else {
        toast.error(result.error || t("share.error"));
      }
    } catch (error) {
      toast.error(t("share.error"));
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    if (!isOwner || loadingMemberId) return;
    setLoadingMemberId(memberId);
    try {
      const result = await updateMemberRole(memberId, newRole);
      if (!result.success) {
        toast.error(result.error || t("share.error"));
      }
    } finally {
      setLoadingMemberId(null);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!isOwner || loadingMemberId) return;
    setLoadingMemberId(memberId);
    try {
      const result = await removeMember(memberId);
      if (result.success) {
        toast.success(t("share.memberRemoved"));
      } else {
        toast.error(result.error || t("share.error"));
      }
    } finally {
      setLoadingMemberId(null);
    }
  };

  const getInitials = (profile) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.email) {
      return profile.email[0].toUpperCase();
    }
    return "?";
  };

  const getDisplayName = (profile) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.email || t("share.unknownUser");
  };

  const RoleIcon = ({ role }) => {
    const roleInfo = MEMBER_ROLES[role];
    const Icon = roleInfo?.icon || Eye;
    return <Icon className="role-icon" style={{ color: roleInfo?.color }} />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="share-list-dialog">
        <DialogHeader>
          <div className="share-dialog-header">
            <div className="share-dialog-icon">
              <Users className="share-dialog-icon-svg" />
            </div>
            <div>
              <DialogTitle>{t("share.title")}</DialogTitle>
              <DialogDescription>
                {t("share.description", { listName: list?.title })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="share-list-content">
          {/* Invite Section */}
          {isOwner && (
            <div className="share-invite-section">
              <form onSubmit={handleInvite} className="share-invite-form">
                <div className="share-invite-input-wrapper">
                  <Mail className="share-invite-input-icon" />
                  <Input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={t("share.emailPlaceholder")}
                    type="email"
                    className="share-invite-input"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="share-role-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">
                      <div className="share-role-option">
                        <Pencil className="share-role-option-icon" />
                        <span>{t("share.roles.editor")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <div className="share-role-option">
                        <Eye className="share-role-option-icon" />
                        <span>{t("share.roles.viewer")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  disabled={!emailInput.trim() || isInviting}
                >
                  <UserPlus className="btn-icon" />
                  {t("share.invite")}
                </Button>
              </form>
            </div>
          )}

          {/* Members List */}
          <div className="share-members-section">
            <div className="share-members-header">
              <h4>{t("share.members")}</h4>
              <Badge variant="secondary" className="share-members-count">
                {members.length}
              </Badge>
            </div>

            <ScrollArea className="share-members-list">
              {/* Owner */}
              {owner && (
                <div className="share-member-item owner">
                  <div className="share-member-info">
                    <Avatar className="share-member-avatar">
                      {owner.profiles?.avatar_url ? (
                        <AvatarImage src={owner.profiles.avatar_url} />
                      ) : null}
                      <AvatarFallback>
                        {getInitials(owner.profiles)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="share-member-details">
                      <span className="share-member-name">
                        {getDisplayName(owner.profiles)}
                        {owner.profiles?.id === currentUserId && (
                          <span className="share-member-you">
                            ({t("share.you")})
                          </span>
                        )}
                      </span>
                      <span className="share-member-email">
                        {owner.profiles?.email}
                      </span>
                    </div>
                  </div>
                  <div className="share-member-role owner-role">
                    <Crown className="owner-crown" />
                    <span>{t("share.roles.owner")}</span>
                  </div>
                </div>
              )}

              {/* Collaborators */}
              {collaborators.map((member) => (
                <div key={member.profiles?.id} className="share-member-item">
                  <div className="share-member-info">
                    <Avatar className="share-member-avatar">
                      {member.profiles?.avatar_url ? (
                        <AvatarImage src={member.profiles.avatar_url} />
                      ) : null}
                      <AvatarFallback>
                        {getInitials(member.profiles)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="share-member-details">
                      <span className="share-member-name">
                        {getDisplayName(member.profiles)}
                        {member.profiles?.id === currentUserId && (
                          <span className="share-member-you">
                            ({t("share.you")})
                          </span>
                        )}
                      </span>
                      <span className="share-member-email">
                        {member.profiles?.email}
                      </span>
                    </div>
                  </div>
                  <div className="share-member-actions">
                    {isOwner ? (
                      <>
                        <Select
                          value={member.role}
                          onValueChange={(role) =>
                            handleRoleChange(member.profiles?.id, role)
                          }
                          disabled={loadingMemberId === member.profiles?.id}
                        >
                          <SelectTrigger className="share-member-role-select">
                            <SelectValue>
                              <div className="share-role-option">
                                <RoleIcon role={member.role} />
                                <span>{t(`share.roles.${member.role}`)}</span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="editor">
                              <div className="share-role-option">
                                <Pencil className="share-role-option-icon" />
                                <span>{t("share.roles.editor")}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="viewer">
                              <div className="share-role-option">
                                <Eye className="share-role-option-icon" />
                                <span>{t("share.roles.viewer")}</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="share-remove-btn"
                          onClick={() =>
                            handleRemoveMember(member.profiles?.id)
                          }
                          disabled={loadingMemberId === member.profiles?.id}
                        >
                          {loadingMemberId === member.profiles?.id ? (
                            <Loader2 className="share-remove-icon spin-animation" />
                          ) : (
                            <X className="share-remove-icon" />
                          )}
                        </Button>
                      </>
                    ) : (
                      <div className="share-member-role-badge">
                        <RoleIcon role={member.role} />
                        <span>{t(`share.roles.${member.role}`)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {collaborators.length === 0 && (
                <div className="share-empty-state">
                  <Shield className="share-empty-icon" />
                  <p>{t("share.noCollaborators")}</p>
                  <span>{t("share.noCollaboratorsDescription")}</span>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
