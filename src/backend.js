exports.httpHandler = {
  endpoints: [
    {
      scope: 'global',
      method: 'GET',
      path: 'settings',
      handle: function handle(ctx) {
        try {
          var project = ctx.settings.project;
          ctx.response.json({
            project: project ? {
              id: project.id,
              name: project.name,
              shortName: project.shortName
            } : null
          });
        } catch (e) {
          ctx.response.json({project: null, error: String(e)});
        }
      }
    }
  ]
};
