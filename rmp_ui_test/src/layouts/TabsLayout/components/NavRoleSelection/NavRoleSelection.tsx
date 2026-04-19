import React, { type FC, useMemo, useState, useCallback } from 'react';
import { Dropdown } from '@ht/sprite-ui';
import { type RoleItemType } from '@/wrappers/UserRole';
import styles from './style.less';
import projectBStyles from '../../projectBStyles.less';

interface NavRoleSelectionProps {
  availableRoles: RoleItemType[];
  onSwitchRole: (roleId: number) => void;
  activeRoleId: number;
}

const RoleSelectDropdown: FC<NavRoleSelectionProps> = ({
  availableRoles,
  onSwitchRole,
  activeRoleId,
}) => {
  return (
    <div className={styles.roleSelectionDropdown}>
      <div className={styles.roleGroup}>
        <div className={styles.roleGroupContent}>
          {availableRoles.map((role) => (
            <div
              key={role.id}
              className={`${styles.roleItem} ${
                role.id === activeRoleId ? styles.active : ''
              }`}
              onClick={() => {
                if (role.id === activeRoleId) {
                  return;
                }
                onSwitchRole(role.id);
              }}
            >
              {role.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NavRoleSelection: FC<NavRoleSelectionProps> = ({
  availableRoles = [],
  onSwitchRole = () => {},
  activeRoleId,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback((flag: boolean) => {
    setOpen(flag);
  }, []);

  const activeRoleName = useMemo(() => {
    const role = availableRoles?.find((r) => r.id === activeRoleId);
    return role?.name || '无选中角色（不应该发生）';
  }, [availableRoles, activeRoleId]);

  return (
    <Dropdown
      overlay={
        <RoleSelectDropdown
          availableRoles={availableRoles}
          activeRoleId={activeRoleId}
          onSwitchRole={(roleId) => {
            onSwitchRole(roleId);
            setOpen(false);
          }}
        />
      }
      onOpenChange={handleOpenChange}
      open={open}
      placement="bottomLeft"
      overlayClassName={projectBStyles.customSpaceSelect}
    >
      <div className={styles.activeRole}>{activeRoleName}</div>
    </Dropdown>
  );
};

export default NavRoleSelection;
