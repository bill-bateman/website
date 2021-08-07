mkdir -p "$HOME/.ssh"
echo "$DEPLOY_KEY" >"$HOME/.ssh/key"
chmod 600 "$HOME/.ssh/key"
rsync -avz --delete -e 'ssh -i $HOME/.ssh/key' ${LOCAL_BUILD_DIRECTORY} ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIRECTORY_NAME}
rm "$HOME/.ssh/key"