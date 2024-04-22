import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    "./src/graphql/schema/schema.graphql",
    "./src/graphql/schema/aws.graphql",
  ],
  generates: {
    "./src/graphql/generated/": {
      preset: "client",
      config: {
        scalars: {
          AWSDateTime: "Date",
          AWSEmail: "string",
          AWSJSON: "string",
          AWSURL: "string",
          AWSTimestamp: "string",
        },
      },
    },
  },
}

export default config
