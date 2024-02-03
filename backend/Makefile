CURRENT_DIR=$(shell pwd)

APP=$(shell basename ${CURRENT_DIR})

APP_CMD_DIR=${CURRENT_DIR}/cmd

IMG_NAME=${APP}
REGISTRY=${REGISTRY}

TAG=v_1
ENV_TAG=v_1

# Including
include .build_info

build-image:
	docker build --rm -t ${REGISTRY}/${IMG_NAME}:${TAG} .
	docker tag ${REGISTRY}/${IMG_NAME}:${TAG} ${REGISTRY}/${IMG_NAME}:${ENV_TAG}

push-image:
	sudo docker push ${REGISTRY}/${IMG_NAME}:${TAG}

proto-gen:
	mkdir -p protos
	rsync -av --exclude=".*" de_protos/. protos

pull-proto-module:
	git submodule update --init --recursive

update-proto-module:
	git submodule update --remote --merge

.PHONY: build-image
