    // const unclaimedNominations = AwardService.getUnclaimedNominations();
    // unclaimedNominations.forEach(unclaimed => {
    //   const existingRole = getRole(unclaimed.nomination.getName());
    //   if (existingRole) {
    //     const previousHolder = existingRole.members.first();
    //     if (previousHolder) {
    //       previousHolder.removeRole(existingRole);
    //     }
    //   }
    // });

// function createRole(roleName) {
//   return Rx.Observable.fromPromise(getGuild().createRole({
//     name: roleName,
//     color: '#' + Math.floor(Math.random() * 16777215).toString(16)
//   }));
// }

// function getRole(name) {
//   return getGuild().roles.find('name', name);
// }

// function getGuild() {
//   if (!guild) {
//     guild = client.guilds.first();
//   }
//   return guild;
// }

// function assignRole(claimedNomination) {
//   const roleName = claimedNomination.nomination.getName();
//   const existingRole = getRole(roleName);
//   if (existingRole) {
//     const previousHolder = existingRole.members.first();
//     if (previousHolder) {
//       if (previousHolder.id !== claimedNomination.account_id) {
//         previousHolder.removeRole(existingRole);
//         assignRoleToMember(existingRole, claimedNomination.account_id);
//         console.log('reassigned existing ' + roleName);
//         return true;
//       } else {
//         console.log('skipped as ' + roleName + ' is already assigned to winner');

//         return false;
//       }
//     } else {
//       console.log('failed to find ' + roleName + ' holder assigned to new one');
//       assignRoleToMember(existingRole, claimedNomination.account_id);
//       return true;
//     }
//   } else {
//     createRole(roleName).subscribe(role => {
//       assignRoleToMember(role, claimedNomination.account_id);
//     });
//     console.log('crated new ' + roleName + ' and assigned');
//     return true;
//   }
// }

// function assignRoleToMember(role, account_id) {
//   const member = getGuild().members.find('id', playersMap.get(account_id));
//   if (member) {
//     member.addRole(role);
//   } else {
//     console.log('failed to find member to assign' + role);
//   }
// }