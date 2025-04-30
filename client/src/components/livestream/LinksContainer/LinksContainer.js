import React from "react";
import BroadcasterLink from "./BroadcasterLink";

const LinksContainer = ({ broadcasters }) => {
  let links = [];
  if (broadcasters.length > 0) {
    for (let broadcaster of broadcasters) {
      links.push(
        <BroadcasterLink
          broadcaster={broadcaster}
          key={broadcaster.socket_id}
        />
      );
    }
    return <div className="links-container">{links}</div>;
  }
  return <p>No Streams</p>;
};

export default LinksContainer;
