import SidebarClient from "./SidebarClient";
import getOutputOrdersGroupUser from "@/core/server/output-orders/getOutputOrdersGroupUsers";
import getReturnOrdersGroupUser from "@/core/server/return-orders/getReturnOrdersGroupUsers";

const Sidebar = async () => {
  //verificar se existe pendencias
  const outputPendency = (await getOutputOrdersGroupUser())
    .outputOrdersGroupUser;
  const retreatPendency = (await getReturnOrdersGroupUser())
    .returnOrdersGroupUser;

  const hasPendency = outputPendency.length > 0 || retreatPendency.length > 0;

  return <SidebarClient hasPendency={hasPendency} />;
};

export default Sidebar;
