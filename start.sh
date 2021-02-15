#!/bin/env bash

pushd .

cd packages/electron && yarn start &

cd packages/ui && yarn start &

popd