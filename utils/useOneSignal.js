import { useEffect } from "react";

const useOneSignal = () =>
  useEffect(() => {
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
      OneSignal.init({
        appId: "87699271-e2eb-4eb4-8792-85dff3cebb35",
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
        persistNotification: true,
      });
    });

    return () => {
      window.OneSignal = undefined;
    };
  }, []); // <-- run this effect once on mount

export default useOneSignal;
