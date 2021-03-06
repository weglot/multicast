import gql from 'graphql-tag';

export const DEVICES = gql`
  {
    devices {
      id
      identifier
      nickname
      address
      model
      supported
      rotation
      status
      channel {
        id
        name
        layout
        duration
        urls
      }
    }
  }
`;

export const ALERTS = gql`
  {
    alerts {
      title
      body
      theme
      devices
    }
  }
`;

export const CHANNELS = gql`
  {
    channels {
      id
      name
      layout
      duration
      urls
      devices {
        id
      }
    }
  }
`;

export const CHANNEL = gql`
  query Channel($id: ID!) {
    channel(id: $id) {
      id
      name
      layout
      duration
      urls
      devices {
        id
      }
    }
  }
`;

export const STATUS = gql`
  {
    status {
      sandbox
    }
  }
`;

export const CONFIGURATION = gql`
  {
    configuration {
      home
      port
      scanningFrequency
      playgroundEnabled
    }
    status {
      sandbox
    }
  }
`;
