# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :cookie_store,
  key: '_chatwoot_session',
  same_site: :none,
  secure: true,
  domain: -> (request) do
    host = request.host
    parts = host.split('.')
    if parts.length > 2
      ".#{parts.last(2).join('.')}"
    else
      host
    end
  end
