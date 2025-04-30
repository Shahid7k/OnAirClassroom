import React from "react";
import { Link } from "react-router-dom";

const BroadcasterLink = ({ broadcaster }) => {
  let broadcasterId = broadcaster.socket_id;
  let name = broadcaster.username;

  return (
    <div>
      <Link
        to={`/watch/${broadcasterId}`}
        class="card card-icon lift lift-sm mb-4"
      >
        <div class="row no-gutters">
          <div class="col-auto card-icon-aside bg-primary">
            <i class="text-white-50" data-feather="compass"></i>
          </div>
          <div class="col">
            <div class="card-body py-5">
              <h5 class="card-title text-primary mb-2">{name}</h5>
              <p class="card-text mb-1">
                Basic information about getting started including installation
                instructions, setup, and basic usage.
              </p>
              <div class="small text-muted">5 articles in this category</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BroadcasterLink;
